import { createApp } from './createApp'
import type { PageContextClient } from '../utils/types'

export function render(pageContext: PageContextClient) {
  const app = createApp(pageContext)
  app.mount('#app')
}

export function onHydrationEnd() {
  const windowUrl = new URL(window.location.href)

  if (windowUrl.searchParams.has('__sw_cache_id')) {
    windowUrl.searchParams.delete('__sw_cache_id')
    window.history.pushState(history.state, '', windowUrl.href)
  }
}

if ('virtualKeyboard' in navigator) {
  navigator.virtualKeyboard.overlaysContent = true
}

void navigator.serviceWorker
  .register('/serviceWorker.ts', { type: 'module' })
  .then(() => console.log('Service Worker registered.'))
  .catch((err) => console.error('Failed to register Service Worker:', err))

/* To enable Client-side Routing:
export const clientRouting = true
// !! WARNING !! Before doing so, read https://vite-plugin-ssr.com/clientRouting */
