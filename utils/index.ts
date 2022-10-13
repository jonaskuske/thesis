// @ts-expect-error
export const isServer = import.meta.env.SSR

// @ts-expect-error
export const isDev = import.meta.env.DEV

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
