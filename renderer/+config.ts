import type { Config } from 'vike/types'

export default {
  hydrationCanBeAborted: true,
  clientRouting: ['SPA', 'ISOMORPHIC'].includes(process.env.PUBLIC_ENV__MODE!),
  meta: {
    Page: {
      env: {
        client: process.env.PUBLIC_ENV__MODE !== 'MPA',
        server: process.env.PUBLIC_ENV__MODE !== 'SPA',
      },
    },
    title: { env: { client: true, server: true } },
  },
} satisfies Config

declare global {
  namespace Vike {
    interface Config {
      title?: string
    }
  }
}
