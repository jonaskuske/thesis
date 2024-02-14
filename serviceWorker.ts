export type {}
declare const self: ServiceWorkerGlobalScope & typeof globalThis

const SHELL_URL = '/_shell'
const MANIFEST_URL = '/assets.json'

const PROD = import.meta.env.PROD

const DEV = import.meta.env.DEV

const BASE_URL = import.meta.env.BASE_URL

function verifyResponseStatus(response: Response) {
  if (!response.ok) throw response
  return response
}

async function cacheShell(updateHash = true): Promise<string> {
  const [cache, shellResp, manifestResp] = await Promise.all([
    caches.open('cache'),
    fetch(SHELL_URL, { headers: { 'cache-control': 'no-cache' } }).then(verifyResponseStatus),
    PROD &&
      fetch(MANIFEST_URL, { headers: { 'cache-control': 'no-cache' } }).then(verifyResponseStatus),
  ])

  const shellHash = shellResp.headers.get('x-shell-hash')
  if (!shellHash) throw Error('Shell response is missing the `x-shell-hash` header')

  await cache.put(
    SHELL_URL,
    new Response(shellResp.body!.pipeThrough(new ShellTransform()), shellResp),
  )

  if (PROD) await cache.put(MANIFEST_URL, manifestResp as Response)

  if (updateHash) await self.registration?.navigationPreload?.setHeaderValue(shellHash)

  return shellHash
}

let initialShellHash: string | null = null

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      initialShellHash = await cacheShell(false)
      // TODO: more asset caching
      const cache = await caches.open('cache')
      await cache.add('/fonts/spacegrotesk/v13/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2')
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      if (self.registration?.navigationPreload?.setHeaderValue != null) {
        initialShellHash ??= await cacheShell(false)
        await self.registration.navigationPreload.enable()
        await self.registration.navigationPreload.setHeaderValue(initialShellHash)
      }
      await self.clients.claim()
    })(),
  )
})

const responseCache = new Map<string, ReadableStream<BufferSource>>()

self.addEventListener('fetch', (event) => {
  if (
    event.request.mode !== 'navigate' &&
    event.request.method === 'GET' &&
    event.request.url.includes('.woff2')
  ) {
    return event.respondWith(
      caches.match(event.request).then((response) => response ?? fetch(event.request)),
    )
  }

  if (event.request.mode === 'navigate' && event.request.method === 'GET') {
    const url = new URL(event.request.url)

    const responseStream = new TransformStream()

    event.respondWith(
      (async () => {
        const shellResponse = (await caches.match(SHELL_URL)) as Response

        return new Response(responseStream.readable, {
          headers: shellResponse.headers,
        })
      })(),
    )

    event.waitUntil(
      (async () => {
        const cacheId = url.searchParams.get('__sw_cache_id')

        if (cacheId && responseCache.has(cacheId)) {
          const cachedResponseStream = responseCache.get(cacheId)

          if (
            cachedResponseStream &&
            !cachedResponseStream.locked &&
            responseCache.delete(cacheId)
          ) {
            return cachedResponseStream.pipeTo(responseStream.writable).then(() => cacheShell())
          }
        }

        const [shellResponse, manifest] = await Promise.all([
          caches.match(SHELL_URL) as Promise<Response>,
          caches
            .match(MANIFEST_URL)
            .then<Record<string, { css?: string[] }> | undefined>((res) => res?.json()),
        ])

        const shellSent = shellResponse
          .body!.pipeThrough(new InsertCssTransform(url, manifest))
          .pipeTo(responseStream.writable, { preventClose: true })

        const shellHash = shellResponse.headers.get('x-shell-hash')!

        const headers = new Headers(event.request.headers)
        headers.set('x-shell-hash', shellHash)

        let serverResponse: Response | undefined

        try {
          // https://github.com/web-platform-tests/wpt/pull/5921#issuecomment-1245559630
          if (event.preloadResponse != null && isFirefox()) {
            serverResponse = await Promise.any([
              event.preloadResponse.then((res: Response | undefined) => res ?? Promise.reject()),
              fetch(new Request(event.request, { headers })),
            ])
          } else {
            serverResponse = await Promise.resolve<Response | undefined>(event.preloadResponse)
          }

          if (serverResponse?.type === 'opaque' || serverResponse?.type === 'opaqueredirect') {
            throw Error("Received an opaque response that can't be streamed.")
          }

          serverResponse ??= await fetch(new Request(event.request, { headers }))
        } catch (err) {
          if ((err as DOMException).name === 'NetworkError') {
            serverResponse = new Response(
              `<h2>Offline</h2><p>Bitte stelle eine Internetverbindung her und versuche es erneut.</p>`,
              {
                headers: { 'content-type': 'text/html', 'x-shell-hash': shellHash },
                status: 504,
              },
            )
          } else {
            serverResponse = new Response(
              `<h2>Error</h2><pre style="white-space:normal">${String(err)}</pre>`,
              {
                headers: { 'content-type': 'text/html', 'x-shell-hash': shellHash },
                status: 500,
              },
            )
          }
        }

        const shellIsUpToDate = shellHash === serverResponse.headers.get('x-shell-hash')

        if (!shellIsUpToDate && event.resultingClientId) {
          const client = await self.clients.get(event.resultingClientId)

          if (isWindowClient(client)) {
            responseCache.set(event.resultingClientId, serverResponse.body!)
            url.searchParams.set('__sw_cache_id', event.resultingClientId)
            await responseStream.writable.close()

            return client.navigate(url)
          }
        }

        await shellSent
        await serverResponse
          .body!.pipeThrough(new ContentTransform())
          .pipeTo(responseStream.writable)

        if (!shellIsUpToDate) {
          await cacheShell()
        }
      })(),
    )
  }
})

function isFirefox(): boolean {
  return /firefox/i.test(self.navigator.userAgent)
}

function isWindowClient(client?: Client): client is WindowClient {
  return client?.type === 'window'
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

class ShellTransform extends TransformStream<BufferSource, BufferSource> {
  constructor() {
    super({
      encoder: new TextEncoder(),
      decoder: new TextDecoder(),
      transform(chunk, controller) {
        const decoded = this.decoder.decode(chunk, { stream: true })

        if (!/<div[^>]*class="content"[^>]*>/su.test(decoded)) {
          return controller.enqueue(chunk)
        }

        let stripped = decoded.replace(/(<div[^>]*class="content"[^>]*>).*/su, '$1')

        if (DEV) {
          const src = `data:application/javascript;utf-8,${encodeURIComponent(
            `(${devRemoveStylesheets.toString()})()`,
          )}`

          stripped = stripped.replace('</head>', `<script src="${src}" async></script>$&`)
        }

        controller.enqueue(this.encoder.encode(stripped))

        controller.terminate()
      },
    } as Transformer<BufferSource, BufferSource> & {
      encoder: TextEncoder
      decoder: TextDecoder
    })
  }
}

/* eslint-disable */
function devRemoveStylesheets() {
  // @ts-ignore
  document.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove())
}
/* eslint-enable */

class InsertCssTransform extends TransformStream<BufferSource, BufferSource> {
  constructor(url: URL, manifest?: Record<string, { css?: string[] }>) {
    if (!manifest) {
      super() // no manifest → no-op
    } else {
      super({
        encoder: new TextEncoder(),
        decoder: new TextDecoder(),
        transform(chunk, controller) {
          const decoded = this.decoder.decode(chunk, { stream: true })

          if (!/<head[^>]*>/su.test(decoded)) {
            return controller.enqueue(chunk)
          }

          const requestPath = url.pathname.match(/^(\/.+?)\/?$/)?.[1] ?? '/index'
          const pageFiles = Object.keys(manifest).filter((file) => file.includes('client:/pages/'))

          const responseFile = pageFiles.find((file) => {
            const filePath = file.replace(/.+client:\/pages/, '')
            return new RegExp(`^${escapeRegExp(filePath).replace(/@[^/.]+/g, '[^./]+')}$`).test(
              requestPath,
            )
          })

          const styleUrls = manifest[responseFile ?? '']?.css ?? []
          const styleHtml = `
          ${styleUrls
            .map(
              (url) => `<link data-async-style rel="preload" as="style" href="${BASE_URL}${url}"/>`,
            )
            .join('\n')}
            <script>
            const asyncStylesheets = document.querySelectorAll('[data-async-style]');
            document.documentElement.dataset.cssLoaded = !asyncStylesheets.length;
            let loadedCount = 0;
            for (const link of asyncStylesheets) {
              link.onload = () => {
                link.rel = "stylesheet";
                link.onload = null;
                document.documentElement.dataset.cssLoaded = ++loadedCount === asyncStylesheets.length;
              }
            }
            </script>`

          const chunkWithInsertedCss = this.encoder.encode(
            decoded.replace(/<head[^>]*>/su, `$&${styleHtml}`),
          )

          controller.enqueue(chunkWithInsertedCss)
        },
      } as Transformer<BufferSource, BufferSource> & { encoder: TextEncoder; decoder: TextDecoder })
    }
  }
}

class ContentTransform extends TransformStream<BufferSource, BufferSource> {
  constructor() {
    super({
      encoder: new TextEncoder(),
      decoder: new TextDecoder(),
      shellStripped: false,
      bufferString: '',
      transform(chunk, controller) {
        if (this.shellStripped) {
          return controller.enqueue(chunk)
        }

        this.bufferString += this.decoder.decode(chunk, { stream: true })

        if (/<div[^>]*class="content"[^>]*>/su.test(this.bufferString)) {
          const stripped = this.bufferString.replace(/.*<div[^>]*class="content"[^>]*>/su, '')

          controller.enqueue(this.encoder.encode(stripped))
          this.shellStripped = true
        }
      },
      flush(controller) {
        if (!this.shellStripped) {
          controller.enqueue(this.encoder.encode(this.bufferString))
        }
      },
    } as Transformer<BufferSource, BufferSource> & {
      encoder: TextEncoder
      decoder: TextDecoder
      bufferString: string
      shellStripped: boolean
    })
  }
}
