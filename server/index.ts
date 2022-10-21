import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ServerResponse } from 'node:http'
import { randomBytes } from 'node:crypto'
import fastify from 'fastify'
import compress from '@fastify/compress'
import cookie from '@fastify/cookie'
import formbody from '@fastify/formbody'
import helmet from '@fastify/helmet'
import appRoutes from './app'
import citiesRoutes from './cities'
import locationsRoutes from './locations'

// @ts-expect-error
const root = fileURLToPath(new URL('..', import.meta.url))
const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV !== 'production'

startServer().catch((err) => console.log('Failed to start server:', err))

async function startServer() {
  const app = fastify({ logger: isDev })

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

  await app.register(appRoutes, { isDev, isProd })
  await app.register(citiesRoutes, { isDev, isProd })
  await app.register(locationsRoutes, { isDev, isProd })

  const port = Number(process.env.PORT ?? 3000)
  await app.listen({ port, host: '0.0.0.0' })
}
