const self$ = self as ServiceWorkerGlobalScope & typeof globalThis

const SHELL_URL = '/_shell'

function verifyResponseStatus(response: Response) {
  if (!response.ok) throw response
  return response
}

async function cacheShell(updateHash = true): Promise<string> {
  const [cache, response] = await Promise.all([
    caches.open('cache'),
    fetch(SHELL_URL).then(verifyResponseStatus),
  ])

  const shellHash = response.headers.get('x-shell-hash')
  if (!shellHash) throw Error('Shell response is missing the `x-shell-hash` header')

  await cache.put(
    SHELL_URL,
    new Response(response.body!.pipeThrough(new ShellTransform()), response),
  )

  if (updateHash) await self$.registration?.navigationPreload?.setHeaderValue(shellHash)

  return shellHash
}

let initialShellHash: string | null = null

self$.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      initialShellHash = await cacheShell(false)
      await self$.skipWaiting()
    })(),
  )
})

self$.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      if (self$.registration?.navigationPreload?.setHeaderValue != null) {
        initialShellHash ??= await cacheShell(false)
        await self$.registration.navigationPreload.enable()
        await self$.registration.navigationPreload.setHeaderValue(initialShellHash)
      }
      await self$.clients.claim()
    })(),
  )
})

const responseCache = new Map<string, ReadableStream<BufferSource>>()

self$.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    const url = new URL(event.request.url)

    const responseStream = new TransformStream()

    event.respondWith(
      new Response(responseStream.readable, {
        headers: { 'content-type': 'text/html;charset=utf-8' },
      }),
    )

    event.waitUntil(
      (async () => {
        const cacheId = url.searchParams.get('__sw_cache_id')

        if (cacheId && responseCache.has(cacheId)) {
          const cachedResponseStream = responseCache.get(cacheId)

          if (cachedResponseStream && responseCache.delete(cacheId)) {
            return cachedResponseStream.pipeTo(responseStream.writable).then(() => cacheShell())
          }
        }

        const shellResponse = (await caches.match(SHELL_URL))!
        const shellSent = shellResponse.body!.pipeTo(responseStream.writable, {
          preventClose: true,
        })

        const shellHash = shellResponse.headers.get('x-shell-hash')!

        const headers = new Headers(event.request.headers)
        headers.set('x-shell-hash', shellHash)

        const serverResponse = await Promise.any(
          [
            event.preloadResponse?.then((r: Response | undefined) => r || Promise.reject()),
            fetch(new Request(event.request, { headers })),
          ].filter(Boolean),
        )

        const shellIsUpToDate = shellHash === serverResponse.headers.get('x-shell-hash')

        if (!shellIsUpToDate && event.resultingClientId) {
          const client = await self$.clients.get(event.resultingClientId)

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

function isWindowClient(client?: Client): client is WindowClient {
  return client?.type === 'window'
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

        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (import.meta.env.DEV) {
          stripped = stripped.replace(
            '</head>',
            `
<script>
document.querySelectorAll('link[rel="stylesheet"]').forEach(e => e.remove())
</script>
$&`.trim(),
          )
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
    } as Transformer<BufferSource, BufferSource> & {
      encoder: TextEncoder
      decoder: TextDecoder
      bufferString: string
      shellStripped: boolean
    })
  }
}
