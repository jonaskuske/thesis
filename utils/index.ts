// @ts-expect-error env is read-only
if (!import.meta.env) import.meta.env = {}

export const isServer = import.meta.env.SSR ?? true

export const isDev = import.meta.env.DEV ?? process.env.NODE_ENV !== 'production'

export const isProd = import.meta.env.PROD ?? process.env.NODE_ENV === 'production'

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
