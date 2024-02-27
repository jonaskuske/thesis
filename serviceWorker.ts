export type {}
declare const self: ServiceWorkerGlobalScope & typeof globalThis

const SHELL_URL = '/_shell'
const MANIFEST_URL = '/assets.json'

const PROD = import.meta.env.PROD

const BASE_URL = import.meta.env.BASE_URL

const MODE = import.meta.env.PUBLIC_ENV__MODE

function verifyResponseStatus(response: Response) {
  if (!response.ok) throw response
  return response
}

async function cacheShell(updateHash = true): Promise<string> {
  const [cache, shellResp, manifestResp] = await Promise.all([
    caches.open('cache'),
    fetch(SHELL_URL, { headers: { 'cache-control': 'no-cache' } }).then(verifyResponseStatus),
    PROD
      ? fetch(MANIFEST_URL, { headers: { 'cache-control': 'no-cache' } }).then(verifyResponseStatus)
      : undefined,
  ])

  const shellHash = shellResp.headers.get('x-shell-hash')
  if (!shellHash) throw Error('Shell response is missing the `x-shell-hash` header')

  await cache.put(
    SHELL_URL,
    new Response(shellResp.body!.pipeThrough(new ShellTransform()), shellResp),
  )

  if (PROD) {
    await cache.put(MANIFEST_URL, manifestResp!.clone())
    const cacheFiles = new Set<string>()
    const manifest = (await manifestResp!.json()) as Record<
      string,
      { file: string; css?: string[] }
    >
    for (const entry of Object.values(manifest)) {
      cacheFiles.add(entry.file)
      if (Array.isArray(entry.css)) entry.css.forEach((f) => cacheFiles.add(f))
    }
    await cache.addAll([
      ...cacheFiles.values(),
      '/fonts/spacegrotesk/v13/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2',
    ])
  }

  if (updateHash) await self.registration?.navigationPreload?.setHeaderValue(shellHash)

  return shellHash
}

let initialShellHash: string | null = null

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      initialShellHash = await cacheShell(false)
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
  if (event.request.mode !== 'navigate' && event.request.method === 'GET') {
    return event.respondWith(
      caches.match(event.request).then(
        (response) =>
          response ??
          fetch(event.request).catch(
            (err) =>
              new Response(`${err}`, {
                status: 500,
                headers: { 'content-type': 'text/plain' },
              }),
          ),
      ),
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
            .then<
              Record<string, { css?: string[]; file: string }> | undefined
            >((res) => res?.json()),
        ])

        const shellSent = shellResponse
          .body!.pipeThrough(new AdjustShellForPageTransform(url, manifest))
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

        const regex =
          MODE === 'SPA'
            ? /(<div[^>]*id="app"[^>]*><\/div>).*/su
            : /(<div[^>]*class="content"[^>]*>).*/su

        if (!regex.test(decoded)) {
          return controller.enqueue(chunk)
        }

        const stripped = decoded.replace(regex, '$1')

        controller.enqueue(this.encoder.encode(stripped))

        controller.terminate()
      },
    } as Transformer<BufferSource, BufferSource> & {
      encoder: TextEncoder
      decoder: TextDecoder
    })
  }
}

class AdjustShellForPageTransform extends TransformStream<BufferSource, BufferSource> {
  constructor(url: URL, manifest?: Record<string, { css?: string[]; file: string }>) {
    super({
      encoder: new TextEncoder(),
      decoder: new TextDecoder(),
      transform(chunk, controller) {
        let decoded = this.decoder.decode(chunk, { stream: true })

        const shouldUpdateLinks = /class="nav-link"/.test(decoded)
        const shouldInsertFromManifest = manifest && /<head[^>]*>/su.test(decoded)

        if (!shouldUpdateLinks && !shouldInsertFromManifest) {
          return controller.enqueue(chunk)
        }

        if (shouldUpdateLinks) {
          decoded = decoded.replace(/class="nav-link"[^>]+href="([^"]+)"/g, (m, g1) => {
            return g1 === url.pathname ? m.replace('class="nav-link', 'class="active nav-link') : m
          })
        }

        if (shouldInsertFromManifest) {
          const jsEntryFile = Object.values(manifest).find(({ file }) =>
            /\/entry-client-routing\.[a-zA-Z0-9]+\.js$/.test(file),
          )?.file

          if (jsEntryFile) {
            decoded = decoded.replace(
              /<head[^>]*>/su,
              `$&<link rel="modulepreload" href="${jsEntryFile}" as="script" type="text/javascript">`,
            )
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

          decoded = decoded.replace(/<head[^>]*>/su, `$&${styleHtml}`)
        }

        controller.enqueue(this.encoder.encode(decoded))
      },
    } as Transformer<BufferSource, BufferSource> & { encoder: TextEncoder; decoder: TextDecoder })
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

        const regex =
          MODE === 'SPA'
            ? /.*(?=(?:<script id="vike_pageContext"))/su
            : /.*<div[^>]*class="content"[^>]*>/su

        if (regex.test(this.bufferString)) {
          const stripped = this.bufferString.replace(regex, '')

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
