import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client'
import type { ComponentOptions } from 'vue'
import type { passToClient } from '../renderer/passToClient'

export type PageContextInit = {
  urlOriginal: string
  contentOnly: boolean
  enableServiceWorker: boolean
  nonce: string
  cookies: { [cookieName: string]: string | undefined }
}

export type PageContextShared = (
  | PageContextBuiltIn<ComponentOptions>
  | PageContextBuiltInClient<ComponentOptions>
) & {
  [Key in typeof passToClient[number]]: Key extends keyof PageContextBuiltIn
    ? PageContextBuiltIn[Key]
    : Key extends keyof PageContextInit
    ? PageContextInit[Key]
    : unknown
} & {
  pageProps?: Record<string, unknown>
  exports: { documentProps?: { title?: string; description?: string } }
}

export type PageContextServer = PageContextShared &
  PageContextBuiltIn<ComponentOptions> &
  PageContextInit

export type PageContextClient = PageContextShared & PageContextBuiltInClient<ComponentOptions>
