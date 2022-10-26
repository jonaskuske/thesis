import { createSSRApp, defineComponent, h } from 'vue'
import PageShell from '../components/PageShell.vue'
import { setPageContext } from '../composables/usePageContext'
import type { PageContextShared } from '../utils/types'

export function createApp(pageContext: PageContextShared) {
  const PageWithLayout = defineComponent({
    render: () => h(PageShell, {}, () => h(pageContext.Page)),
  })

  const app = createSSRApp(PageWithLayout)

  pageContext.pageExports = {} // overwrite deprecated property

  // Make `pageContext` available from any Vue component
  setPageContext(app, pageContext)

  return app
}
