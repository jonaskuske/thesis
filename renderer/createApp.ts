import { createSSRApp, defineComponent, h, markRaw, reactive } from 'vue'
import PageShell from '../components/PageShell.vue'
import { setPageContext } from '../composables/usePageContext'
import type { PageContext } from 'vike/types'
import type { Component } from './types'

export function createApp(pageContext: PageContext) {
  const { Page } = pageContext

  let rootComponent: Component & { Page: Component }

  const PageWithWrapper = defineComponent({
    data: () => ({
      Page: markRaw(Page),
    }),
    created() {
      rootComponent = this
    },
    render() {
      return h(PageShell, {}, { default: () => h(Page) })
    },
  })

  const app = createSSRApp(PageWithWrapper)

  const pageContextReactive = reactive(pageContext)

  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext)
      rootComponent.Page = markRaw(pageContext.Page)
    },
  })

  setPageContext(app, pageContextReactive)

  return app
}

// Same as `Object.assign()` but with type inference
function objectAssign<Obj extends object, ObjAddendum>(
  obj: Obj,
  objAddendum: ObjAddendum,
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}
