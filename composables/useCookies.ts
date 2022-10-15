import { isServer } from '../utils'
import type { PageContextServer } from '../utils/types'
import { usePageContext } from './usePageContext'

export function useCookies() {
  const ctx = usePageContext()

  const get = (name: string) => {
    if (isServer) return (ctx as PageContextServer).cookies[name]
    else return window.cookieStore.get(name).then((c) => c?.value)
  }

  const set = (name: string, val: string) => {
    if (isServer) {
      console.error('Application must not set cookies on server.')
    } else {
      return window.cookieStore.set(name, val)
    }
  }

  return [get, set] as const
}
