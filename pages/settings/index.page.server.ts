import type { PageContextServer } from '../../utils/types'

export function onBeforeRender(ctx: PageContextServer) {
  const userId = ctx.cookies.user_id

  const locationIsOn = ctx.cookies.location_pref === '1'
  const notificationIsOn = ctx.cookies.notification_pref === '1'

  return {
    pageContext: {
      pageProps: { userId, locationIsOn, notificationIsOn },
    },
  }
}
