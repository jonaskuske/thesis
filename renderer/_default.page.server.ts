import { pipeToNodeWritable, type SSRContext } from '@vue/server-renderer'
import { escapeInject, stampPipe } from 'vite-plugin-ssr'
import { createApp } from './createApp'
import type { PageContextServer } from '../utils/types'
import type internal from 'stream'

export { render }
export { passToClient } from './passToClient'

function render(pageContext: PageContextServer) {
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

  const documentHtml = pageContext.contentOnly
    ? escapeInject`${pipeWrapper}</div></div>`
    : escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=block">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>body{font-family: 'Space Grotesk', sans-serif}</style>
        <meta name="description" content="${desc}" />
        <title>${title}</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">
        <link rel="manifest" href="/favicons/site.webmanifest">
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5">
        <link rel="shortcut icon" href="/favicons/favicon.ico">
        <meta name="msapplication-TileColor" content="#2b5797">
        <meta name="msapplication-config" content="/favicons/browserconfig.xml">
      </head>
      <body>
        <div id="app">${pipeWrapper}</div>`

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true,
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  }
}
