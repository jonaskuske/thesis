import { allowAnimations } from '../utils'
import { applyStickyObserver, type StickyObserverDirection } from '../utils/applyStickyObserver'

if (import.meta.env.PUBLIC_ENV__APP_SHELL === 'true') {
  void import('./initServiceWorker')

  const title = document.querySelector<HTMLDivElement>('.content')!.dataset.siteTitle as string
  const titleEl = document.querySelector<HTMLAnchorElement>('.navigation .title span')!

  document.title = title

  if (titleEl.textContent !== title) {
    if (!allowAnimations) titleEl.textContent = title
    else {
      void titleEl
        .animate([{ opacity: 0 }], { duration: 150, easing: 'ease-in', fill: 'forwards' })
        .finished.then(() => {
          titleEl.textContent = title
          titleEl.animate([{ opacity: 1 }], { duration: 150, easing: 'ease-in', fill: 'forwards' })
        })
    }
  }
}

document
  .querySelectorAll<HTMLElement>('[v-sticky]')
  .forEach((el) => applyStickyObserver(el, el.getAttribute('v-sticky') as StickyObserverDirection))

if (typeof URLPattern !== 'undefined') {
  const { hostname, port, pathname, protocol } = location
  const pattern = new URLPattern({ hostname, port, pathname, protocol })

  document.querySelectorAll('a').forEach((a) => {
    if (pattern.test(a.href)) a.classList.add('active')
  })
}
