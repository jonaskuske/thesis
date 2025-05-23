import path from 'node:path'
import { fileURLToPath } from 'node:url'
// import { randomBytes } from 'node:crypto'
import fastify from 'fastify'
import compress from '@fastify/compress'
import cookie from '@fastify/cookie'
import formbody from '@fastify/formbody'
import earlyHints from '@fastify/early-hints'
// import helmet from '@fastify/helmet'
import {
  // isDev,
  isProd,
} from '../utils/index.ts'
import appRoutes from './app.ts'
import citiesRoutes from './cities.ts'
import locationsRoutes from './locations.ts'
import loginRoutes from './login.ts'
import logoutRoutes from './logout.ts'

const root = fileURLToPath(new URL('..', import.meta.url))

startServer().catch((err) => console.log('Failed to start server:', err))

async function startServer() {
  const app = fastify({ logger: false })

  await app.register(compress)

  await app.register(cookie, { parseOptions: { path: '/', sameSite: 'strict', maxAge: 31536000 } })

  await app.register(formbody)

  if (process.env.ENABLE_EARLY_HINTS === 'true') {
    await app.register(earlyHints, {
      warn: process.env.NODE_ENV === 'development',
    })
  }

  // await app.register(helmet, {
  //   referrerPolicy: { policy: 'origin-when-cross-origin' },
  //   contentSecurityPolicy: {
  //     reportOnly: isDev,
  //     directives: {
  //       scriptSrc: [
  //         "'self'",
  //         // inline script for async style loading, inserted by service worker
  //         "'sha256-3/uIJeHJ/p+H4+NczdkU7XjyfRDgTdak9Ze5eREQRMo='",
  //         // eslint-disable-next-line
  //         (_, res: any) => `nonce-${(res.cspNonce = randomBytes(16).toString('hex'))}`,
  //       ],
  //       connectSrc: ["'self'", 'https://nominatim.openstreetmap.org'],
  //     },
  //   },
  // })

  if (isProd) {
    const fastifyStatic = (await import('@fastify/static')).default
    await app.register(fastifyStatic, {
      root: path.join(root, 'dist/client'),
      wildcard: false,
      immutable: true,
      maxAge: isProd ? 1000 * 60 * 60 * 24 * 365 : 1000 * 60,
      setHeaders(res, path) {
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

  app.get('/health', (request, reply) => {
    return { status: 200, statusText: 'OK' }
  })

  await app.register(appRoutes)
  await app.register(citiesRoutes)
  await app.register(locationsRoutes)
  await app.register(loginRoutes)
  await app.register(logoutRoutes)

  const port = Number(process.env.PORT ?? 3000)
  await app.listen({ port, host: '0.0.0.0' })
}
