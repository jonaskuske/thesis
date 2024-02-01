export type { Component }

import type { ComponentPublicInstance } from 'vue'
type Component = ComponentPublicInstance

type Page = Component

declare global {
  namespace Vike {
    interface PageContext {
      Page: Page
      config: Vike.Config
      data: unknown
      abortReason?: string
      urlOriginal: string
      contentOnly: boolean
      enableServiceWorker: boolean
      enableHydration: boolean
      nonce: string
      cookies: { [cookieName: string]: string | undefined }
      headerTitle?: string
    }
  }
}
