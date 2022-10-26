import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client'
import type { ComponentOptions } from 'vue'
import type { passToClient } from '../renderer/passToClient'

export type PageContextInit = {
  urlOriginal: string
  contentOnly: boolean
  enableServiceWorker: boolean
  enableHydration: boolean
  nonce: string
  cookies: { [cookieName: string]: string | undefined }
}

export type PageContextShared<PageData = undefined> = (
  | PageContextBuiltIn<ComponentOptions>
  | PageContextBuiltInClient<ComponentOptions>
) & {
  [Key in typeof passToClient[number]]: Key extends keyof PageContextBuiltIn
    ? PageContextBuiltIn[Key]
    : Key extends keyof PageContextInit
    ? PageContextInit[Key]
    : unknown
} & {
  data: PageData
  exports: { documentProps?: { title?: string; description?: string } }
}

export type PageContextServer<PageData = undefined> = PageContextShared<PageData> &
  PageContextBuiltIn<ComponentOptions> &
  PageContextInit

export type PageContextClient<PageData = undefined> = PageContextShared<PageData> &
  PageContextBuiltInClient<ComponentOptions>

export type OnBeforeRender<PageData = undefined> = (pageContext: PageContextServer) => void | {
  pageContext: Partial<PageContextServer<PageData>>
}
