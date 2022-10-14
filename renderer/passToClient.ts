// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = [
  'enableServiceWorker',
  'pageProps',
  'routeParams',
  'urlPathname',
  'urlParsed',
] as const
