/// <reference no-default-lib="true"/>
/// <reference lib="es2022" />
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope & typeof globalThis

const SHELL_URL = '/?shell_only=true'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open('le-cache')
      .then((cache) => cache.add(SHELL_URL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('fetch', (event) => {
  console.log('fetch', event)

  if (event.request.mode === 'navigate') {
    const url = new URL(event.request.url)
    url.searchParams.append('content_only', 'true')

    const { readable, writable } = new TransformStream()

    const shellFetch = caches.match(SHELL_URL).then((response) => response!.body)
    const bodyFetch = fetch(url).then((response) => response.body)

    void shellFetch
      .then((body) => body?.pipeTo(writable, { preventClose: true }))
      .then(() => bodyFetch)
      .then((body) => body?.pipeTo(writable))

    console.log('responding!')
    event.respondWith(new Response(readable, { headers: { 'Content-Type': 'text/html' } }))
  }
})

export {}
