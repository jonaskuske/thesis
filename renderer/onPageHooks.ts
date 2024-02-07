import type { OnHydrationEndSync } from 'vike/types'

export const onHydrationEnd: OnHydrationEndSync = (pageContext): ReturnType<OnHydrationEndSync> => {
  if (pageContext.enableServiceWorker) {
    import('./initServiceWorker')
  }
}
