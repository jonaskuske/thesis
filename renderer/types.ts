import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client'
import type { ComponentOptions } from 'vue'
import type { passToClient } from './passToClient'

export type PageContextInit = { urlOriginal: string; contentOnly?: boolean }

export type PageProps = Record<string, unknown>

// The `pageContext` that are available in both on the server-side and browser-side
export type PageContext = {
  [Key in typeof passToClient[number]]: Key extends keyof PageContextBuiltIn
    ? PageContextBuiltIn[Key]
    : Key extends keyof PageContextInit
    ? PageContextInit[Key]
    : unknown
} & {
  pageProps?: PageProps
  exports: { documentProps?: { title?: string; description?: string } }
} & Partial<PageContextInit>

export type PageContextServer = PageContextBuiltIn<ComponentOptions> & PageContext & PageContextInit

export type PageContextClient = PageContextBuiltInClient<ComponentOptions> & PageContext
