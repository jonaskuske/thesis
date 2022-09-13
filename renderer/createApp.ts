import { createSSRApp, defineComponent, h } from 'vue'
import PageShell from '../components/PageShell.vue'
import { setPageContext } from '../composables/usePageContext'
import type { PageContextShared } from '../utils/types'

export function createApp(pageContext: PageContextShared) {
  const { Page, pageProps } = pageContext

  const PageWithLayout = defineComponent({
    render: () => h(PageShell, {}, () => h(Page, pageProps || {})),
  })

  const app = createSSRApp(PageWithLayout)

  // Make `pageContext` available from any Vue component
  setPageContext(app, pageContext)

  return app
}
