import type { OnHydrationEndSync } from 'vike/types'

export const onHydrationEnd: OnHydrationEndSync = (): ReturnType<OnHydrationEndSync> => {
  if (import.meta.env.PUBLIC_ENV__APP_SHELL === 'true') {
    import('./initServiceWorker')
  }
}
