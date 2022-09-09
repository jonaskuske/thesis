const sw = self as ServiceWorkerGlobalScope & typeof globalThis

type TextTransformer = Transformer & { decoder: TextDecoder; encoder: TextEncoder }

const SHELL_URL = '/?shell_only=true'

sw.addEventListener('install', (event) => {
  event.waitUntil(cacheShell().then(() => sw.skipWaiting()))
})

sw.addEventListener('activate', (event) => {
  event.waitUntil(sw.clients.claim())
})

let isPending = false
async function cacheShell() {
  if (isPending) return

  isPending = true
  const cache = await caches.open('cache')
  await cache.add(SHELL_URL)
  isPending = false
}

sw.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    const url = new URL(event.request.url)

    url.searchParams.append('content_only', 'true')

    const TrimShell = new TransformStream({
      encoder: new TextEncoder(),
      decoder: new TextDecoder(),
      transform(this: TextTransformer, chunk, controller) {
        const decoded = this.decoder.decode(chunk, { stream: true })

        if (!decoded.includes('<div data-marker')) return controller.enqueue(chunk)

        const strippedChunk = decoded.replace(/<div data-marker.*/su, '')

        controller.enqueue(this.encoder.encode(strippedChunk))
        controller.terminate()
      },
    } as TextTransformer)

    const TrimContent = new TransformStream({
      encoder: new TextEncoder(),
      decoder: new TextDecoder(),
      transform(this: TextTransformer, chunk, controller) {
        const decoded = this.decoder.decode(chunk, { stream: true })

        if (!decoded.includes('</head>')) return controller.enqueue(chunk)

        const strippedChunk = decoded.replace(/.*<\/head>\s*/su, '')
        controller.enqueue(this.encoder.encode(strippedChunk))
      },
    } as TextTransformer)

    const { readable, writable } = new TransformStream()
    const contentBuffer = new TransformStream()

    void fetch(url)
      .then((response) => response.body)
      .then((body) => body?.pipeThrough(TrimContent).pipeTo(contentBuffer.writable))

    event.waitUntil(
      caches
        .match(SHELL_URL)
        .then((response) => response.body)
        .then((body) => body.pipeThrough(TrimShell).pipeTo(writable, { preventClose: true }))
        .then(() => contentBuffer.readable.pipeTo(writable))
        .then(cacheShell),
    )

    event.respondWith(new Response(readable, { headers: { 'Content-Type': 'text/html' } }))
  }
})
