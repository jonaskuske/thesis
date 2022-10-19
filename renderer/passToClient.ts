// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = [
  'enableServiceWorker',
  'enableHydration',
  'pageProps',
  'routeParams',
  'urlPathname',
  'urlParsed',
  'headerTitle',
] as const
