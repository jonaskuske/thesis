import { isServer } from '.'
import type { CookieStore } from 'cookie-store'

type KeyValMap = {
  user_id: string
  geolocation_enabled: boolean
  notifications_enabled: boolean
  location_ids: string[]
}

type Keys = keyof KeyValMap

let cookieStore: CookieStore | null = null

type Cookies = Record<string, string | undefined>

const getCookieStore = async () => {
  return (
    window.cookieStore || cookieStore || (cookieStore = (await import('cookie-store')).cookieStore)
  )
}

export function get<Name extends Keys>(name: Name): Promise<KeyValMap[Name] | null>
export function get<Name extends Keys>(name: Name, cookieStore: Cookies): KeyValMap[Name] | null
export function get<Name extends Keys>(
  name: Name,
  cookieStore?: Cookies,
): KeyValMap[Name] | null | Promise<KeyValMap[Name] | null> {
  if (isServer && !cookieStore) {
    throw Error('Argument `cookieStore` is required when called on the server.')
  }

  if (isServer) {
    const cookieValue = cookieStore![name]
    return cookieValue ? (JSON.parse(decodeURIComponent(cookieValue)) as KeyValMap[Name]) : null
  } else {
    return getCookieStore()
      .then((store) => store.get(name))
      .then((cookie) =>
        cookie?.value ? (JSON.parse(decodeURIComponent(cookie.value)) as KeyValMap[Name]) : null,
      )
  }
}

export function set<T extends Keys>(name: T, val: KeyValMap[T]): Promise<void> {
  if (isServer) {
    throw Error('Application must not set cookies on server.')
  } else {
    return getCookieStore().then((store) =>
      store.set(name, encodeURIComponent(JSON.stringify(val))),
    )
  }
}

export function remove(name: Keys): Promise<void> {
  if (isServer) {
    throw Error('Application must not remove cookies on server.')
  } else {
    return getCookieStore().then((store) => store.delete(name))
  }
}
