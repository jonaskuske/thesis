// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = [
  'enableServiceWorker',
  // 'contentOnly', mustn't be passed, client doesn't know about content-only
  'enableHydration',
  'pageProps',
  'data',
  'routeParams',
  'urlPathname',
  'urlParsed',
  'headerTitle',
]
