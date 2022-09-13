import path from 'path'
import { fileURLToPath } from 'url'
import fastify from 'fastify'
import compress from '@fastify/compress'
import helmet from '@fastify/helmet'
import { renderPage } from 'vite-plugin-ssr'
import { createHash } from 'crypto'
import type { ServerResponse } from 'http'
import type { PageContextInit } from '../renderer/types'

// @ts-expect-error
const root = fileURLToPath(new URL('..', import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'

startServer().catch((err) => console.error('Failed to start server', err))

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

  const shell = await renderPage({ urlOriginal: '/_shell' })
  const body = (await shell.httpResponse?.getBody()) as string
  let hash = createHash('SHA1').update(body).digest('hex')

  app.get<{ Querystring: Record<string, string> }>('*', async (request, reply) => {
    request.headers['x-shell-hash'] ??= request.headers['service-worker-navigation-preload']

    if (!isProduction) {
      const shell = await renderPage<{}, PageContextInit>({ urlOriginal: '/_shell' })
      const body = (await shell.httpResponse?.getBody()) as string
      hash = createHash('SHA1').update(body).digest('hex')
    }

    const pageContext = await renderPage<{}, PageContextInit>({
      urlOriginal: request.url,
      contentOnly: request.headers['x-shell-hash'] === hash,
    })

    if (!pageContext.httpResponse) return

    const { httpResponse } = pageContext

    if (!isProduction) {
      console.log(
        new Date().toLocaleTimeString(),
        request.url,
        pageContext.contentOnly
          ? `contentOnly (${request.headers['x-shell-hash'] as string} from ${
              request.headers['service-worker-navigation-preload']
                ? 'service-worker-navigation-preload'
                : 'x-shell-hash'
            })`
          : '',
      )
    }

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
