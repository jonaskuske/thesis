// `usePageContext` allows us to access `pageContext` in any Vue component.
// See https://vite-plugin-ssr.com/pageContext-anywhere

import { inject, isReactive, reactive, toRefs, type ToRefs } from 'vue'
import type { App, InjectionKey } from 'vue'
import type { PageContextShared } from '../utils/types'

const key: InjectionKey<ToRefs<PageContextShared>> = Symbol()

export function usePageContext(): ToRefs<PageContextShared>
export function usePageContext<Context>(): ToRefs<Context>

export function usePageContext() {
  const pageContext = inject(key)
  if (!pageContext) throw new Error('setPageContext() not called in parent')
  return pageContext
}

export function setPageContext(app: App, pageContext: PageContextShared) {
  app.provide(key, toRefs(isReactive(pageContext) ? pageContext : reactive(pageContext)))
}
