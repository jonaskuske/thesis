import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import type { ComponentOptions } from 'vue'
import type { passToClient } from './_default.page.server'

export type PageProps = Record<string, unknown>
// The `pageContext` that are available in both on the server-side and browser-side
export type PageContext = {
  [Key in typeof passToClient[number]]: Key extends keyof PageContextBuiltIn
    ? PageContextBuiltIn[Key]
    : unknown
} & {
  Page: ComponentOptions
  pageProps?: PageProps

  exports: {
    documentProps?: {
      title?: string
      description?: string
    }
  }
}
