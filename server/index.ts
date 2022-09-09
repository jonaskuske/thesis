import path from 'path'
import { fileURLToPath } from 'url'
import fastify from 'fastify'
import compress from '@fastify/compress'
import { renderPage } from 'vite-plugin-ssr'

// @ts-expect-error
const root = fileURLToPath(new URL('..', import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'

startServer().catch((err) => console.error('Failed to start server', err))

async function startServer() {
  const app = fastify()

  await app.register(compress)

  if (isProduction) {
    const fastifyStatic = (await import('@fastify/static')).default
    await app.register(fastifyStatic, {
      root: path.join(root, 'dist/client/assets'),
      prefix: '/assets',
    })
  } else {
    const middie = (await import('@fastify/middie')).default
    await app.register(middie, { hook: 'onRequest' })

    const vite = await import('vite')
    const devServer = await vite.createServer({ root, server: { middlewareMode: true } })
    await app.use(devServer.middlewares)
  }

  app.get<{ Querystring: Record<string, string> }>('*', async (request, reply) => {
    const pageContext = await renderPage({ urlOriginal: request.url })

    if (!pageContext.httpResponse) return

    const { httpResponse } = pageContext

    if (!isProduction) console.log(new Date().toLocaleTimeString(), request.url)

    reply.raw.statusCode = httpResponse.statusCode
    reply.raw.setHeader('Content-Type', httpResponse.contentType)
    httpResponse.pipe(reply.raw)
  })

  const port = Number(process.env.PORT ?? 3000)
  await app.listen({ port })
  console.log(`Server running at http://localhost:${port}`)
}
