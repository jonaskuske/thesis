if (import.meta.env.PUBLIC_ENV__APP_SHELL === 'true') {
  import('./initServiceWorker')
}

if (location.pathname !== '/') {
  document.querySelector<HTMLAnchorElement>('.navigation .back')!.style.display = ''
  document.querySelector<HTMLAnchorElement>('.navigation .title span')!.textContent =
    document.querySelector<HTMLDivElement>('.content')!.dataset.title as string
}

if (/^\/locations\/\d+$/.test(location.pathname)) {
  const editLink = document.querySelector<HTMLAnchorElement>('.navigation .edit')!
  editLink.href = `${location.pathname}/edit`
  editLink.style.display = ''
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
