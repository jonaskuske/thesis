// @ts-expect-error env is read-only
if (!import.meta.env) import.meta.env = {}

export const isServer = import.meta.env.SSR ?? true

export const isDev = import.meta.env.DEV ?? process.env.NODE_ENV !== 'production'

export const isProd = import.meta.env.PROD ?? process.env.NODE_ENV === 'production'

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function range(to: number): number[]
export function range(from: number, to: number): number[]
export function range(_toOrFrom: number, _to?: number): number[] {
  const from = _to != null ? _toOrFrom : 0
  const to = _to ?? _toOrFrom
  return Array.from(Array(to - from), (_, idx) => idx - from)
}

export function getRandomInt(maximum: number): number
export function getRandomInt(minimum: number, maximum: number): number
export function getRandomInt(_minOrMax: number, _max?: number) {
  const minimum = _max != null ? _minOrMax : 0
  const maximum = _max ?? _minOrMax
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
}
