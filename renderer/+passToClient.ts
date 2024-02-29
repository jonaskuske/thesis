// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = [
  // 'contentOnly', mustn't be passed, client doesn't know about content-only
  'headerTitle',
  ...(['SPA', 'ISOMORPHIC'].includes(process.env.PUBLIC_ENV__MODE!)
    ? [] // provided by default in spa mode
    : ['routeParams', 'urlPathname', 'urlParsed']),
]
