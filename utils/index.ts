// @ts-expect-error
export const isServer = import.meta.env.SSR

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
