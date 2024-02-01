import { createApp } from './createApp'
import type { OnRenderClientSync } from 'vike/types'

let app: ReturnType<typeof createApp>
const onRenderClient: OnRenderClientSync = (pageContext): ReturnType<OnRenderClientSync> => {
  if (pageContext.enableHydration) {
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
