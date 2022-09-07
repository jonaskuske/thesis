import { createSSRApp, defineComponent, h } from 'vue'
import PageShell from './PageShell.vue'
import { setPageContext } from './usePageContext'
import type { PageContext } from './types'

export { createApp }

function createApp(pageContext: PageContext) {
  const { Page, pageProps } = pageContext

  const PageWithLayout = defineComponent({
    render: () => h(PageShell, {}, () => h(Page, pageProps || {})),
  })

  const app = createSSRApp(PageWithLayout)

  // Make `pageContext` available from any Vue component
  setPageContext(app, pageContext)

  return app
}
