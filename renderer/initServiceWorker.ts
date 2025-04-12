import { isDev } from '../utils/index.ts'

const windowUrl = new URL(window.location.href)

if (windowUrl.searchParams.has('__sw_cache_id')) {
  windowUrl.searchParams.delete('__sw_cache_id')
  window.history.pushState(history.state, '', windowUrl.href)
}

const swFileType = isDev ? 'ts' : 'js'

navigator.serviceWorker
  .register(`/serviceWorker.${swFileType}`, { type: isDev ? 'module' : 'classic' })
  .then(() => console.log('Service Worker registered.'))
  .catch((err) => console.error('Failed to register Service Worker:', err))
