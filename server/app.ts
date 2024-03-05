import { PassThrough } from 'node:stream'
import { createHash } from 'node:crypto'
import type { FastifyPluginAsync } from 'fastify'
import { renderPage } from 'vike/server'
import { isDev } from '../utils'

const _HASH_PREFIX_ = 'v1'

async function getShellHash() {
  const shell = await renderPage({
    contentOnly: false,
    urlOriginal: '/_shell',
    nonce: '',
    cookies: {},
    language: 'de',
  })

  const body = (await shell.httpResponse?.getBody())!
  return createHash('SHA1')
    .update(_HASH_PREFIX_ + body)
    .digest('hex')
}

type IHeaders = { 'x-shell-hash'?: string; 'service-worker-navigation-preload'?: string }

const routes: FastifyPluginAsync = async (fastify) => {
  let hash = await getShellHash()

  fastify.get<{ Headers: IHeaders }>('*', async (request, reply) => {
    request.headers['x-shell-hash'] ??= request.headers['service-worker-navigation-preload']

    if (isDev) hash = await getShellHash()

    const contentOnly = request.headers['x-shell-hash'] === hash

    const preRenderTime = performance.now()

    const pageContext = await renderPage({
      contentOnly,
      urlOriginal: request.url,
      nonce: (reply.raw as any).cspNonce, // eslint-disable-line
      cookies: request.cookies,
      language: request.headers['accept-language']?.split(',')[0].split(';')[0] || 'de',
    })

    const renderTime = performance.now() - preRenderTime

    if (!pageContext.httpResponse) return

    if (contentOnly)
      request.log.info(`contentOnly: ${request.url} (${request.headers['x-shell-hash']!})`)

    const { httpResponse } = pageContext

    await reply.writeEarlyHintsLinks([
      {
        rel: 'preload',
        as: 'font',
        href: `/fonts/spacegrotesk/v13/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2`,
      },
      ...httpResponse.earlyHints.map((link) => 'link: ' + link.earlyHintLink),
    ])

    const responseStream = new PassThrough()

    httpResponse.pipe(responseStream)

    await reply
      .status(httpResponse.statusCode)
      .headers(Object.fromEntries(httpResponse.headers))
      .header('x-shell-hash', hash)
      .header('vary', 'x-shell-hash,service-worker-navigation-preload')
      .header('server-timing', `render;dur=${renderTime};desc="Vue Render"`)
      .send(responseStream)
  })
}

export default routes
