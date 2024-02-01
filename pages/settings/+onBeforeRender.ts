import type { OnBeforeRenderSync } from 'vike/types'
import * as store from '../../utils/cookies'

const onBeforeRender: OnBeforeRenderSync = ({ cookies }): ReturnType<OnBeforeRenderSync> => {
  const userId = store.get('user_id', cookies)
  const geolocationEnabled = store.get('geolocation_enabled', cookies) === true
  const notificationsEnabled = store.get('notifications_enabled', cookies) === true

  return {
    pageContext: {
      data: { userId, geolocationEnabled, notificationsEnabled },
    },
  }
}

export { onBeforeRender }
