import path from 'path'
import { fileURLToPath } from 'url'
import fastify from 'fastify'
import compress from '@fastify/compress'
import { renderPage } from 'vite-plugin-ssr'

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

  app.get('*', async (request, reply) => {
    const pageContext = await renderPage({ urlOriginal: request.url })

    if (!pageContext.httpResponse) return

    const { body, statusCode, contentType } = pageContext.httpResponse
    return reply.code(statusCode).type(contentType).send(body)
  })

  const port = Number(process.env.PORT ?? 3000)
  await app.listen({ port })
  console.log(`Server running at http://localhost:${port}`)
}
