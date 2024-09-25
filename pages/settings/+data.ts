import type { PageContextServer } from 'vike/types'
import * as store from '../../utils/cookies.ts'

export type Data = Awaited<ReturnType<typeof data>>

export async function data({ cookies }: PageContextServer) {
  const userId = store.get('user_id', cookies)
  const geolocationEnabled = store.get('geolocation_enabled', cookies) === true
  const notificationsEnabled = store.get('notifications_enabled', cookies) === true

  return { userId, geolocationEnabled, notificationsEnabled }
}
