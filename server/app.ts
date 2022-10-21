import { PassThrough } from 'node:stream'
import { createHash } from 'node:crypto'
import type { FastifyPluginAsync } from 'fastify'
import { renderPage } from 'vite-plugin-ssr'
import type { PageContextInit } from '../utils/types'

async function getShellHash() {
  const shell = await renderPage<{}, PageContextInit>({
    contentOnly: false,
    urlOriginal: '/_shell',
    enableServiceWorker: process.env.DISABLE_SW !== 'true',
    enableHydration: process.env.DISABLE_JS !== 'true',
    nonce: '',
    cookies: {},
  })

  const body = (await shell.httpResponse?.getBody())!
  return createHash('SHA1').update(body).digest('hex')
}

type IHeaders = { 'x-shell-hash'?: string; 'service-worker-navigation-preload'?: string }

const routes: FastifyPluginAsync<{ isDev: boolean; isProd: boolean }> = async (
  fastify,
  opts = { isDev: true, isProd: false },
) => {
  let hash = await getShellHash()

  fastify.get<{ Headers: IHeaders }>('*', async (request, reply) => {
    request.headers['x-shell-hash'] ??= request.headers['service-worker-navigation-preload']

    if (opts.isDev) hash = await getShellHash()

    const contentOnly = request.headers['x-shell-hash'] === hash

    const preRenderTime = performance.now()

    const pageContext = await renderPage<{}, PageContextInit>({
      contentOnly,
      urlOriginal: request.url,
      enableServiceWorker: process.env.DISABLE_SW !== 'true',
      enableHydration: process.env.DISABLE_JS !== 'true',
      nonce: (reply.raw as any).cspNonce, // eslint-disable-line
      cookies: request.cookies,
    })

    const renderTime = performance.now() - preRenderTime

    if (!pageContext.httpResponse) return

    if (contentOnly)
      request.log.info(`contentOnly: ${request.url} (${request.headers['x-shell-hash']!})`)

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
}

export default routes
