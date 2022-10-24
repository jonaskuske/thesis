import { isServer } from '../utils'
import type { PageContextServer } from '../utils/types'
import { usePageContext } from './usePageContext'
import type { CookieStore } from 'cookie-store'

let store: CookieStore | null = null
const getCookieStore = async () => {
  return (
    window.cookieStore ||
    store ||
    (store = await import('cookie-store').then((m) => m.cookieStore as CookieStore))
  )
}

export function useCookies() {
  const ctx = usePageContext()

  const get = (name: string) => {
    if (isServer) return (ctx as PageContextServer).cookies[name]
    else {
      return getCookieStore().then((store) => store.get(name).then((c) => c?.value))
    }
  }

  const set = (name: string, val: string) => {
    if (isServer) {
      console.error('Application must not set cookies on server.')
    } else {
      return getCookieStore().then((store) => store.set(name, val))
    }
  }

  const remove = (name: string) => {
    if (isServer) {
      console.error('Application must not remove cookies on server.')
    } else {
      return getCookieStore().then((store) => store.delete(name))
    }
  }

  return { get, set, remove }
}
