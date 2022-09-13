// `usePageContext` allows us to access `pageContext` in any Vue component.
// See https://vite-plugin-ssr.com/pageContext-anywhere

import { inject } from 'vue'
import type { App, InjectionKey } from 'vue'
import type { PageContextShared } from '../utils/types'

const key: InjectionKey<PageContextShared> = Symbol()

export function usePageContext(): PageContextShared
export function usePageContext<Context>(): Context

export function usePageContext() {
  const pageContext = inject(key)
  if (!pageContext) throw new Error('setPageContext() not called in parent')
  return pageContext
}

export function setPageContext(app: App, pageContext: PageContextShared) {
  app.provide(key, pageContext)
}
