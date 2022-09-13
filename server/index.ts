import path from 'path'
import { fileURLToPath } from 'url'
import fastify from 'fastify'
import compress from '@fastify/compress'
import helmet from '@fastify/helmet'
import { renderPage } from 'vite-plugin-ssr'
import { createHash } from 'crypto'
import type { ServerResponse } from 'http'
import type { PageContextInit } from '../utils/types'

// @ts-expect-error
const root = fileURLToPath(new URL('..', import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'

startServer().catch((err) => console.error('Failed to start server', err))

async function getShellHash() {
  const shell = await renderPage<{}, PageContextInit>({
    urlOriginal: '/_shell',
    contentOnly: false,
  })

  const body = (await shell.httpResponse?.getBody()) as string
  return createHash('SHA1').update(body).digest('hex')
}

async function startServer() {
  const app = fastify()

  await app.register(compress)

  await app.register(helmet, { contentSecurityPolicy: { reportOnly: true } })

  if (isProduction) {
    const fastifyStatic = (await import('@fastify/static')).default
    await app.register(fastifyStatic, {
      root: path.join(root, 'dist/client'),
      wildcard: false,
      immutable: true,
      maxAge: isProduction ? 1000 * 60 * 60 * 24 * 365 : 1000 * 60,
      setHeaders(res: ServerResponse, path: string) {
        if (path.endsWith('.ts')) res.setHeader('Content-Type', 'text/javascript;charset=utf-8')
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

  app.get<{ Querystring: Record<string, string> }>('*', async (request, reply) => {
    request.headers['x-shell-hash'] ??= request.headers['service-worker-navigation-preload']

    if (!isProduction) hash = await getShellHash()

    const contentOnly = request.headers['x-shell-hash'] === hash

    if (!isProduction) {
      console.log(
        new Date().toLocaleTimeString(),
        request.url,
        contentOnly ? `contentOnly (${request.headers['x-shell-hash'] as string})` : '',
      )
    }

    const pageContext = await renderPage<{}, PageContextInit>({
      urlOriginal: request.url,
      contentOnly,
    })

    if (!pageContext.httpResponse) return

    const { httpResponse } = pageContext

    reply.raw.statusCode = httpResponse.statusCode
    reply.raw.setHeader('content-type', httpResponse.contentType)
    reply.raw.setHeader('x-shell-hash', hash)
    reply.raw.setHeader('vary', 'x-shell-hash,service-worker-navigation-preload')

    httpResponse.pipe(reply.raw)

    return new Promise((resolve) => reply.raw.once('finish', resolve))
  })

  const port = Number(process.env.PORT ?? 3000)
  await app.listen({ port })
  console.log(`Server running at http://localhost:${port}`)
}
