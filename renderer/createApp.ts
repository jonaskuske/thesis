import {
  createSSRApp,
  createApp as createClientApp,
  defineComponent,
  h,
  markRaw,
  reactive,
  ref,
} from 'vue'
import PageShell from '../components/PageShell.vue'
import { setPageContext } from '../composables/usePageContext.ts'
import type { PageContext } from 'vike/types'

export function createApp(pageContext: PageContext) {
  const { Page } = pageContext

  const pageRef = ref(markRaw(Page))

  const PageWithWrapper = defineComponent({
    render() {
      return h(PageShell, {}, { default: () => h(pageRef.value) })
    },
  })

  const app =
    import.meta.env.PUBLIC_ENV__MODE === 'SPA'
      ? createClientApp(PageWithWrapper)
      : createSSRApp(PageWithWrapper)

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
