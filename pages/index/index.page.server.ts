import cities from 'zip-to-city/germany.json'
import type { PageContextServer } from '../../utils/types'

export function onBeforeRender(pageContext: PageContextServer) {
  const locationIds = new Set(JSON.parse(pageContext.cookies.locations || '[]') as string[])

  const locations = [...locationIds]
    .map((id) => cities.find((city) => city.id === id))
    .filter((city): city is typeof cities[0] => city != null)

  return {
    pageContext: { pageProps: { locations, locationIds } },
  }
}
