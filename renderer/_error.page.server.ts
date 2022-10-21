import type { PageContextServer } from '../utils/types'

export function onBeforeRender(pageContext: PageContextServer) {
  const headerTitle = pageContext.is404 ? '404' : '500'

  return {
    pageContext: { headerTitle },
  }
}
