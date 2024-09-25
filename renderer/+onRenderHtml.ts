import { pipeToNodeWritable, type SSRContext } from '@vue/server-renderer'
import { escapeInject, stampPipe } from 'vike/server'
import type { OnRenderHtmlSync } from 'vike/types'
import { createApp } from './createApp.ts'
import type internal from 'stream'
import { allowAnimations } from '../utils/index.ts'

const MODE = import.meta.env.PUBLIC_ENV__MODE

const onRenderHtml: OnRenderHtmlSync = (pageContext): ReturnType<OnRenderHtmlSync> => {
  let pageView: ((w: internal.Writable) => void) | string = ''

  if (pageContext.Page) {
    const appCtx: SSRContext = {}
    const app = createApp(pageContext)
    pageView = (writable: internal.Writable) => pipeToNodeWritable(app, appCtx, writable)
    stampPipe(pageView, 'node-stream')
  }

  const title = pageContext.title ?? pageContext.config.title ?? 'ISS Tracker'

  const shellAttribute = pageContext.urlPathname === '/_shell' ? ' data-app-shell=true' : ''
  const classAttribute = allowAnimations ? ' class=allow-animations' : ''

  let documentHtml: ReturnType<typeof escapeInject>

  if (pageContext.contentOnly) {
    documentHtml =
      MODE === 'SPA' ? escapeInject`${pageView}` : escapeInject`${pageView}</div></div>`
  } else {
    documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en"${shellAttribute}${classAttribute}>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Demo application for thesis on stream-stitched app shell architecture" />
        <title>${title}</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">
        <link rel="manifest" href="/favicons/site.webmanifest">
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5">
        <link rel="shortcut icon" href="/favicons/favicon.ico">
        <meta name="msapplication-TileColor" content="#2b5797">
        <meta name="msapplication-config" content="/favicons/browserconfig.xml">
        <link rel="preload" as="font" href="/fonts/spacegrotesk/v13/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2" crossorigin="anonymous">
        <style>
          @font-face {
            font-family: 'Space Grotesk';
            font-style: normal;
            font-weight: 400;
            font-display: ${MODE === 'MPA' ? 'fallback' : 'swap'};
            src: url(/fonts/spacegrotesk/v13/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          @font-face {
            font-family: 'Space Grotesk';
            font-style: normal;
            font-weight: 700;
            font-display: ${MODE === 'MPA' ? 'fallback' : 'swap'};
            src: url(/fonts/spacegrotesk/v13/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          @font-face {
            font-family: 'Adjusted Arial Fallback';
            src: local(Arial);
            size-adjust: 98%;
            ascent-override: 99%;
            descent-override: 28%;
            line-gap-override: 3%;
          }
          body, ::before, ::after, input, button {
            font-family: 'Adjusted Arial Fallback';
            font-family: 'Space Grotesk', 'Adjusted Arial Fallback', sans-serif;
          }
          [data-css-loaded="false"] .layout::after,
          .layout:not(:has(.content))::after,
          #app:empty::after,
          .page-transition .content::after {
            content: "Loading...";
            display: block;
            margin: auto;
            position: sticky;
            bottom: 50vh;
            left: 0;
            width: 100%;
            text-align: center;
          }
          .allow-animations[data-css-loaded="false"] .layout::after,
          .allow-animations .layout:not(:has(.content))::after,
          .allow-animations #app:empty::after,
          .allow-animations .page-transition .content::after {
            opacity: 0;
            animation: appear 150ms 450ms ease-in forwards;
          }
          [data-css-loaded="false"] .content {
            display: none;
          }
          .allow-animations .content > * {
            transition: opacity 350ms ease;
          }
          .page-transition .content > * {
            opacity: 0;
          }
          @keyframes appear {
            @from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        </style>
      </head>
      <body>
        <div id="app">${pageView}</div>`
  }

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true,
    },
  }
}

export default onRenderHtml
