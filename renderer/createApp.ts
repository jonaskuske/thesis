import { createSSRApp, defineComponent, h, markRaw, reactive, ref, type Ref } from 'vue'
import PageShell from '../components/PageShell.vue'
import { setPageContext } from '../composables/usePageContext'
import type { PageContext } from 'vike/types'
import type { Component } from './types'

export function createApp(pageContext: PageContext) {
  const { Page } = pageContext

  let pageRef: Ref<Component>

  const PageWithWrapper = defineComponent({
    setup() {
      pageRef = ref(markRaw(Page))
      return { Page: pageRef }
    },
    render() {
      return h(PageShell, {}, { default: () => h(this.Page) })
    },
  })

  const app = createSSRApp(PageWithWrapper)

  const pageContextReactive = reactive(pageContext)

  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext)
      pageRef.value = markRaw(pageContext.Page)
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
