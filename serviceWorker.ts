export type {}
declare const self: ServiceWorkerGlobalScope & typeof globalThis

let MANIFEST: typeof ASSET_MANIFEST | undefined
declare const ASSET_MANIFEST: Record<string, { file: string; css?: string[] }>

let CACHE_NAME = Promise.resolve('cache')

const SHELL_URL = '/_shell'

const PROD = import.meta.env.PROD

const BASE_URL = import.meta.env.BASE_URL

const MODE = import.meta.env.PUBLIC_ENV__MODE

const pathToTitleMap = new Map<string, string>()

if (PROD) {
  MANIFEST = ASSET_MANIFEST
  CACHE_NAME = crypto.subtle
    .digest('SHA-1', new TextEncoder().encode(JSON.stringify(MANIFEST)))
    .then((data) => new TextDecoder().decode(data))
}

function verifyResponseStatus(response: Response) {
  if (!response.ok) throw response
  return response
}

async function cacheShell(updateHash = true): Promise<string> {
  const [cache, shellResp] = await Promise.all([
    caches.open(await CACHE_NAME),
    fetch(SHELL_URL, { headers: { 'cache-control': 'no-cache' } }).then(verifyResponseStatus),
  ])

  const shellHash = shellResp.headers.get('x-shell-hash')
  if (!shellHash) throw Error('Shell response is missing the `x-shell-hash` header')

  await cache.put(
    SHELL_URL,
    new Response(shellResp.body!.pipeThrough(new ShellTransform()), shellResp),
  )

  if (PROD) {
    const cacheFiles = new Set<string>()
    for (const entry of Object.values(MANIFEST!)) {
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
      const allowList = new Set([await CACHE_NAME])
      const cacheKeys = await caches.keys()
      await Promise.all(
        cacheKeys.filter((key) => !allowList.has(key)).map((key) => caches.delete(key)),
      )
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
              new Response(JSON.stringify({ err: String(err) }), {
                status: 500,
                headers: { 'content-type': 'application/json' },
              }),
          ),
      ),
    )
  }

  if (event.request.mode === 'navigate') {
    const url = new URL(event.request.url)
    const referrer = event.request.referrer

    const responseStream = new TransformStream()
    const shellResponse = caches.match(SHELL_URL) as Promise<Response>

    event.respondWith(
      shellResponse.then(({ headers }) => new Response(responseStream.readable, { headers })),
    )

    event.waitUntil(
      (async () => {
        const cacheId = url.searchParams.get('__sw_cache_id')

        if (cacheId && responseCache.has(cacheId)) {
          const cachedResponseStream = responseCache.get(cacheId)

          if (
            cachedResponseStream &&
            cachedResponseStream.locked === false &&
            responseCache.delete(cacheId)
          ) {
            return cachedResponseStream.pipeTo(responseStream.writable).then(() => cacheShell())
          }
        }

        const shellSent = (await shellResponse)
          .body!.pipeThrough(new AdjustShellForPageTransform(url, referrer))
          .pipeTo(responseStream.writable, { preventClose: true })

        const shellHash = (await shellResponse).headers.get('x-shell-hash')!

        const headers = new Headers(event.request.headers)
        headers.set('x-shell-hash', shellHash)
        headers.set('x-req-url', url.href)

        let serverResponse: Response | undefined

        try {
          // https://github.com/web-platform-tests/wpt/pull/5921#issuecomment-1245559630
          if (event.preloadResponse != null && isFirefox()) {
            serverResponse = await Promise.any([
              event.preloadResponse.then((res: Response | undefined) => res ?? Promise.reject()),
              fetch(new Request(event.request, { headers, redirect: 'follow' })),
            ])
          } else {
            serverResponse = await Promise.resolve<Response | undefined>(event.preloadResponse)
          }

          serverResponse ??= await fetch(
            new Request(event.request, { headers, redirect: 'follow' }),
          )

          if (serverResponse?.type === 'opaque' || serverResponse?.type === 'opaqueredirect') {
            throw Error("Received an opaque response that can't be streamed.")
          }
        } catch (err) {
          if ((err as DOMException).name === 'NetworkError') {
            serverResponse = new Response(
              `<div class="content"><h2>Offline</h2><p>Please make sure you're connected to the internet and try again.</p></div>`,
              {
                headers: { 'content-type': 'text/html', 'x-shell-hash': shellHash },
                status: 504,
              },
            )
          } else {
            serverResponse = new Response(
              `<div class="content"><h2>Error</h2><pre style="white-space:normal">${String(err)}</pre></div>`,
              {
                headers: { 'content-type': 'text/html', 'x-shell-hash': shellHash },
                status: 500,
              },
            )
          }
        }

        const shellIsUpToDate = shellHash === serverResponse.headers.get('x-shell-hash')
        const hadRedirect = serverResponse.url !== event.request.url

        if (event.resultingClientId && (hadRedirect || !shellIsUpToDate)) {
          const client = await self.clients.get(event.resultingClientId)

          if (isWindowClient(client)) {
            const nextUrl = hadRedirect ? new URL(serverResponse.url) : url
            responseCache.set(event.resultingClientId, serverResponse.body!)
            nextUrl.searchParams.set('__sw_cache_id', event.resultingClientId)
            await responseStream.writable.close()

            return client.navigate(nextUrl)
          }
        }

        await shellSent
        await serverResponse
          .body!.pipeThrough(new ContentTransform(url))
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
          MODE === 'SPA' ? /(<div[^>]*id="app"[^>]*>).*/su : /<div[^>]*class="content"[^>]*>.*/su

        if (!regex.test(decoded)) {
          return controller.enqueue(chunk)
        }

        const stripped = decoded.replace(regex, MODE === 'SPA' ? '$1' : '')

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
  constructor(url: URL, referrer: string) {
    super({
      encoder: new TextEncoder(),
      decoder: new TextDecoder(),
      transform(chunk, controller) {
        let decoded = this.decoder.decode(chunk, { stream: true })

        const shouldUpdateNavLinks = /class="nav-link"/.test(decoded)
        const shouldInsertFromManifest = MANIFEST && /<head[^>]*>/su.test(decoded)
        const shouldUpdateEditLink =
          /^\/locations\/\d+$/.test(url.pathname) &&
          /<a class="edit(?: [^"]*)?"[^>]*href="([^"]*)"/su.test(decoded)
        const shouldUpdateBackLink =
          url.pathname !== '/' && /<a class="back(?: [^"]*)?"[^>]*/su.test(decoded)
        const shouldUpdateTitle = url.pathname !== '/' && /<h1/su.test(decoded)

        if (
          !(
            shouldUpdateNavLinks ||
            shouldInsertFromManifest ||
            shouldUpdateEditLink ||
            shouldUpdateBackLink ||
            shouldUpdateTitle
          )
        ) {
          return controller.enqueue(chunk)
        }

        if (shouldUpdateNavLinks) {
          decoded = decoded.replace(/class="nav-link"[^>]+href="([^"]+)"/g, (m, g1) => {
            return g1 === url.pathname ? m.replace('class="nav-link', 'class="active nav-link') : m
          })
        }

        if (shouldUpdateEditLink) {
          const href = `${url.pathname}/edit`
          decoded = decoded.replace(
            /(<a[^>]+class="edit(?: [^"]*)?"[^>]+style="\s*)display\s*:\s*none\s*;?/su,
            '$1',
          )
          decoded = decoded.replace(
            /(<a[^>]+class="edit(?: [^"]*)?"[^>]+)href="[^"]*"/su,
            `$1href="${href}"`,
          )
        }

        if (shouldUpdateBackLink) {
          const next = url.pathname.replace(/\/[^/]+$/, '')
          const href = !next || next === '/locations' ? '/' : next
          decoded = decoded.replace(
            /(<a[^>]+class="back(?: [^"]*)?"[^>]+style="\s*)display\s*:\s*none\s*;?/su,
            '$1',
          )
          decoded = decoded.replace(
            /(<a[^>]+class="back(?: [^"]*)?"[^>]+)href="[^"]*"/su,
            `$1href="${href}"`,
          )
        }

        if (shouldUpdateTitle) {
          let title: string | false | undefined

          if (MODE === 'MPA') {
            const referrerPath = referrer && new URL(referrer).pathname
            title = referrerPath !== '/' && pathToTitleMap.get(referrerPath)
          }

          decoded = decoded.replace(
            /(<h1[^>]+class="title(?: [^"]*)?"[^>]*>\s*<span[^>]*>)[^<]*<\/span>/su,
            `$1${title || '&nbsp;'}</span>`,
          )
        }

        if (shouldInsertFromManifest) {
          const jsEntryFile = Object.values(MANIFEST!).find(({ file }) =>
            /\/entry-client-routing\.[a-zA-Z0-9]+\.js$/.test(file),
          )?.file

          if (jsEntryFile) {
            decoded = decoded.replace(
              /<head[^>]*>/su,
              `$&<link rel="modulepreload" href="${jsEntryFile}" as="script" type="text/javascript">`,
            )
          }

          const requestPath = url.pathname.match(/^(\/.+?)\/?$/)?.[1] ?? '/index'
          const pageFiles = Object.keys(MANIFEST!).filter((file) => file.includes('client:/pages/'))

          const responseFile = pageFiles.find((file) => {
            const filePath = file.replace(/.+client:\/pages/, '')
            return new RegExp(`^${escapeRegExp(filePath).replace(/@[^/.]+/g, '[^./]+')}$`).test(
              requestPath,
            )
          })

          const styleUrls = MANIFEST![responseFile ?? '']?.css ?? []
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
  constructor(url: URL) {
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

        if (MODE === 'MPA' && /data-title="([^"]+)"/.test(this.bufferString)) {
          pathToTitleMap.set(url.pathname, this.bufferString.match(/data-title="([^"]+)"/)![1])
        }

        const regex =
          MODE === 'SPA'
            ? /.*(?=(?:<script id="vike_pageContext"))/su
            : /.*(?=(?:<div[^>]*class="content"[^>]*>))/su

        if (regex.test(this.bufferString)) {
          const prefix = MODE === 'SPA' ? '</div>' : ''
          const stripped = this.bufferString.replace(regex, '')

          controller.enqueue(this.encoder.encode(prefix + stripped))
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
