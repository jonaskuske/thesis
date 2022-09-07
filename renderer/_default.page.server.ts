import { renderToString } from '@vue/server-renderer'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { createApp } from './app'
import type { PageContext } from './types'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'

export { render }
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'routeParams', 'urlPathname', 'urlParsed'] as const

async function render(pageContext: PageContextBuiltIn & PageContext) {
  const app = createApp(pageContext)
  const appHtml = await renderToString(app)

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.exports
  const title = (documentProps && documentProps.title) || 'Thesis'
  const desc = (documentProps && documentProps.description) || 'Prototype for the thesis'

  const documentHtml =
    pageContext.urlParsed.search.content_only === 'true'
      ? dangerouslySkipEscape(appHtml)
      : escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
        <script>navigator.serviceWorker.register('./sw.ts', { type: 'module' })</script>
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}`

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  }
}
