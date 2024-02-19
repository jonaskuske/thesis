import type { Config } from 'vike/types'
import { passToClient } from './passToClient'
import { onHydrationEnd } from './onPageHooks'

export default {
  passToClient,
  hydrationCanBeAborted: true,
  clientRouting: import.meta.env.PUBLIC_ENV__DISABLE_SPA !== 'true',
  onHydrationEnd,
  meta: {
    Page: { env: { client: process.env.PUBLIC_ENV__DISABLE_SPA !== 'true', server: true } },
    headerTitle: { env: { client: true, server: true } },
    documentProps: { env: { client: true, server: true } },
  },
} satisfies Config

declare global {
  namespace Vike {
    interface Config {
      documentProps?: Record<string, string>
      headerTitle?: string
    }
  }
}
