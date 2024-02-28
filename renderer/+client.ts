if (import.meta.env.PUBLIC_ENV__APP_SHELL === 'true') {
  import('./initServiceWorker')

  if (location.pathname !== '/') {
    const title = document.querySelector<HTMLDivElement>('.content')!.dataset.title as string
    const titleEl = document.querySelector<HTMLAnchorElement>('.navigation .title span')!
    void titleEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'ease-in' })
    document.title = title
    document.querySelector<HTMLAnchorElement>('.navigation .title span')!.textContent = title
  }
}

if (typeof URLPattern !== 'undefined') {
  const { hostname, port, pathname, protocol } = location
  const pattern = new URLPattern({ hostname, port, pathname, protocol })

  document.querySelectorAll('a').forEach((a) => {
    if (pattern.test(a.href)) a.classList.add('active')
  })
}
