import { pipeToNodeWritable, type SSRContext } from '@vue/server-renderer'
import { escapeInject, stampPipe } from 'vite-plugin-ssr'
import { createApp } from './app'
import type { PageContext } from './types'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import type internal from 'stream'

export { render }
export { passToClient } from './passToClient'

function render(pageContext: PageContextBuiltIn & PageContext) {
  const appCtx: SSRContext = {}
  const app = createApp(pageContext)

  const pipeWrapper = (writable: internal.Writable) => {
    pipeToNodeWritable(app, appCtx, writable)
  }
  stampPipe(pipeWrapper, 'node-stream')

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.exports
  const title = (documentProps && documentProps.title) || 'Thesis'
  const desc = (documentProps && documentProps.description) || 'Prototype for the thesis'

  const documentHtml =
    pageContext.urlParsed.search.content_only === 'true'
      ? escapeInject`${pipeWrapper}</div></div>`
      : escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="app">${pipeWrapper}`

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true,
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  }
}
