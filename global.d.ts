/// <reference types="vite/client" />
/// <reference types="urlpattern-polyfill" />

interface ImportMetaEnv {
  readonly PUBLIC_ENV__MODE: 'MPA' | 'SPA' | 'ISOMORPHIC'
  readonly PUBLIC_ENV__APP_SHELL: 'true' | 'false'
  readonly PUBLIC_ENV__ANIMATIONS: 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  cookieStore: CookieStore
}
interface Navigator {
  virtualKeyboard: { overlaysContent: boolean }
}

interface CookieStore extends EventTarget {
  get(name?: string): Promise<CookieListItem | null>
  get(options?: CookieStoreGetOptions): Promise<CookieListItem | null>

  getAll(name?: string): Promise<CookieList>
  getAll(options?: CookieStoreGetOptions): Promise<CookieList>

  set(name: string, value: string): Promise<void>
  set(options: CookieInit): Promise<void>

  delete(name: string): Promise<void>
  delete(options: CookieStoreDeleteOptions): Promise<void>
}

interface CookieStoreGetOptions {
  name?: string
  url?: string
}

type CookieSameSite = 'strict' | 'lax' | 'none'

interface CookieInit {
  name: string
  value: string
  expires?: number | Date | null
  domain?: string | null
  path?: string
  sameSite?: CookieSameSite
  httpOnly?: boolean
}

interface CookieStoreDeleteOptions {
  name: string
  domain?: string | null
  path?: string
}

interface CookieListItem {
  name: string
  value: string
  domain?: string | null
  path?: string
  expires?: Date | null
  secure?: boolean
  sameSite?: CookieSameSite
}

type CookieList = CookieListItem[]
