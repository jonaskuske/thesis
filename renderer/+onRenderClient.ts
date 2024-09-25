import { createApp } from './createApp.ts'
import type { OnRenderClientSync } from 'vike/types'

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

let app: ReturnType<typeof createApp>
const onRenderClient: OnRenderClientSync = (pageContext): ReturnType<OnRenderClientSync> => {
  if (import.meta.env.PUBLIC_ENV__MODE !== 'MPA') {
    if (!app) {
      app = createApp(pageContext)
      app.mount('#app')
    } else {
      app.changePage(pageContext)
    }
  }
}

if ('virtualKeyboard' in navigator) {
  navigator.virtualKeyboard.overlaysContent = true
}

export default onRenderClient
