// @ts-expect-error
if (!import.meta.env) import.meta.env = {}

// @ts-expect-error
export const isServer = import.meta.env.SSR ?? true

// @ts-expect-error
export const isDev = import.meta.env.DEV ?? process.env.NODE_ENV !== 'production'

// @ts-expect-error
export const isProd = import.meta.env.PROD ?? process.env.NODE_ENV === 'production'

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
