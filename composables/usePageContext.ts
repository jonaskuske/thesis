// `usePageContext` allows us to access `pageContext` in any Vue component.
// See https://vike.dev/pageContext-anywhere

import { inject } from 'vue'
import type { App, InjectionKey } from 'vue'
import type { PageContext } from 'vike/types'

const key: InjectionKey<PageContext> = Symbol()

export function usePageContext() {
  const pageContext = inject(key)
  if (!pageContext) throw new Error('setPageContext() not called in parent')
  return pageContext
}

export function setPageContext(app: App, pageContext: PageContext) {
  app.provide(key, pageContext)
}
