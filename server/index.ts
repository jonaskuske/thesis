import path from 'path'
import { fileURLToPath } from 'url'
import fastify, { type FastifyRequest } from 'fastify'
import compress from '@fastify/compress'
import cookie from '@fastify/cookie'
import formbody from '@fastify/formbody'
import helmet from '@fastify/helmet'
import { renderPage } from 'vite-plugin-ssr'
import { createHash, randomBytes } from 'crypto'
import type { ServerResponse } from 'http'
import type { PageContextInit } from '../utils/types'
import { PassThrough } from 'stream'

// @ts-expect-error
const root = fileURLToPath(new URL('..', import.meta.url))
const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV !== 'production'

startServer().catch((err) => console.error('Failed to start server', err))

async function getShellHash() {
  const shell = await renderPage<{}, PageContextInit>({
    urlOriginal: '/_shell',
    contentOnly: false,
    enableServiceWorker: process.env.DISABLE_SW !== 'true',
    enableHydration: process.env.DISABLE_JS !== 'true',
    nonce: '',
    cookies: {},
  })

  const body = (await shell.httpResponse?.getBody()) as string
  return createHash('SHA1').update(body).digest('hex')
}

async function startServer() {
  const app = fastify()

  await app.register(compress)

  await app.register(cookie)

  await app.register(formbody)

  await app.register(helmet, {
    contentSecurityPolicy: {
      reportOnly: isDev,
      directives: {
        scriptSrc: [
          "'self'",
          // eslint-disable-next-line
          (_, res: any) => `nonce-${(res.cspNonce = randomBytes(16).toString('hex'))}`,
        ],
        connectSrc: ["'self'", 'https://nominatim.openstreetmap.org'],
      },
    },
  })

  if (isProd) {
    const fastifyStatic = (await import('@fastify/static')).default
    await app.register(fastifyStatic, {
      root: path.join(root, 'dist/client'),
      wildcard: false,
      immutable: true,
      maxAge: isProd ? 1000 * 60 * 60 * 24 * 365 : 1000 * 60,
      setHeaders(res: ServerResponse, path: string) {
        if (path.endsWith('.ts')) {
          res.setHeader('content-type', 'text/javascript;charset=utf-8')
        }
        if (/s(?:ervice)?-?(?:worker)?\.[jt]s/i.test(path)) {
          res.setHeader('cache-control', 'no-cache')
        }
      },
    })
  } else {
    const middie = (await import('@fastify/middie')).default
    await app.register(middie, { hook: 'onRequest' })

    const vite = await import('vite')
    const devServer = await vite.createServer({ root, server: { middlewareMode: true } })
    await app.use(devServer.middlewares)
  }

  let hash = await getShellHash()

  app.post<{ Body: { id: string } }>(
    '/locations',
    { schema: { body: { type: 'object', properties: { id: { type: 'string' } } } } },
    async (request, reply) => {
      if (isDev) logRequest(request, hash)

      const cookies = JSON.parse(request.cookies.locations || '[]') as string[]

      const ids = new Set(cookies)
      ids.add(request.body.id)

      await reply
        .cookie('locations', JSON.stringify([...ids]))
        .redirect(303, '/')
        .send()
    },
  )

  app.get<{ Querystring: Record<string, string> }>('*', async (request, reply) => {
    request.headers['x-shell-hash'] ??= request.headers['service-worker-navigation-preload']

    if (isDev) {
      hash = await getShellHash()
      logRequest(request, hash)
    }

    const preRenderTime = performance.now()

    const pageContext = await renderPage<{}, PageContextInit>({
      urlOriginal: request.url,
      contentOnly: request.headers['x-shell-hash'] === hash,
      enableServiceWorker: process.env.DISABLE_SW !== 'true',
      enableHydration: process.env.DISABLE_JS !== 'true',
      nonce: (reply.raw as any).cspNonce, // eslint-disable-line
      cookies: request.cookies,
    })

    const renderTime = performance.now() - preRenderTime

    if (!pageContext.httpResponse) return

    const { httpResponse } = pageContext

    const responseStream = new PassThrough()

    httpResponse.pipe(responseStream)

    await reply
      .status(httpResponse.statusCode)
      .type(httpResponse.contentType)
      .header('x-shell-hash', hash)
      .header('vary', 'x-shell-hash,service-worker-navigation-preload')
      .header('server-timing', `render;dur=${renderTime};desc="Vue Render"`)
      .send(responseStream)
  })

  const port = Number(process.env.PORT ?? 3000)
  await app.listen({ port, host: '0.0.0.0' })
  console.log(`Server running at http://localhost:${port}`)
}

function logRequest(request: FastifyRequest, shellHash: string) {
  const contentOnly = shellHash === request.headers['x-shell-hash']

  console.log(
    new Date().toLocaleTimeString(),
    request.url,
    contentOnly ? `contentOnly (${request.headers['x-shell-hash'] as string})` : '',
  )
}
