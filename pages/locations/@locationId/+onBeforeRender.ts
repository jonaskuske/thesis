import type { OnBeforeRenderSync } from 'vike/types'
import cities from 'zip-to-city/germany.json'

const onBeforeRender: OnBeforeRenderSync = (pageContext): ReturnType<OnBeforeRenderSync> => {
  const id = pageContext.routeParams.locationId

  return {
    pageContext: {
      title: cities.find((c) => c.id === id)?.city || '404',
    },
  }
}

export { onBeforeRender }
