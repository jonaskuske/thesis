import type { OnHydrationEndSync } from 'vike/types'
import { isDev } from '../utils'

export const onHydrationEnd: OnHydrationEndSync = (pageContext): ReturnType<OnHydrationEndSync> => {
  const windowUrl = new URL(window.location.href)

  if (windowUrl.searchParams.has('__sw_cache_id')) {
    windowUrl.searchParams.delete('__sw_cache_id')
    window.history.pushState(history.state, '', windowUrl.href)
  }

  if (pageContext.enableServiceWorker) {
    navigator.serviceWorker
      .register('/serviceWorker.ts', { type: isDev ? 'module' : 'classic' })
      .then(() => console.log('Service Worker registered.'))
      .catch((err) => console.error('Failed to register Service Worker:', err))
  }
}
