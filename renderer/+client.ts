if (import.meta.env.PUBLIC_ENV__APP_SHELL === 'true') {
  import('./initServiceWorker')
}

declare class URLPattern {
  constructor(options: Partial<Location>)
  test(string: string): boolean
}

if (typeof URLPattern !== 'undefined') {
  const { hostname, port, pathname, protocol } = location
  const pattern = new URLPattern({ hostname, port, pathname, protocol })

  document.querySelectorAll('a').forEach((a) => {
    if (pattern.test(a.href)) a.classList.add('active')
  })
}
