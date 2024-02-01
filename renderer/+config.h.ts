import type { Config } from 'vike/types'
import { passToClient } from './passToClient'
import { onHydrationEnd } from './onPageHooks'

export default {
  passToClient,
  hydrationCanBeAborted: true,
  clientRouting: false,
  onHydrationEnd,
  meta: {
    Page: { env: { client: process.env.DISABLE_JS !== 'true', server: true } },
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
