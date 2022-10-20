import cities from 'zip-to-city/germany.json'
import type { PageContextServer } from '../../utils/types'

export function onBeforeRender(pageContext: PageContextServer) {
  const id = pageContext.routeParams.locationId

  return {
    pageContext: {
      headerTitle: cities.find((c) => c.id === id)?.city || '404',
    },
  }
}
