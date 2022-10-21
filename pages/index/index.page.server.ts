import cities from 'zip-to-city/germany.json'
import type { PageContextServer } from '../../utils/types'

export function onBeforeRender(pageContext: PageContextServer) {
  const locationIds = new Set(JSON.parse(pageContext.cookies.locations || '[]') as string[])

  const locations = [...locationIds]
    .map((id) => cities.find((city) => city.id === id))
    .filter((city): city is typeof cities[0] => city != null)

  const search = pageContext.urlParsed.search?.location?.toLowerCase() ?? ''
  const results = search
    ? cities.filter(
        ({ city, zip }) => city.toLowerCase().startsWith(search) || zip.startsWith(search),
      )
    : []

  return {
    pageContext: { pageProps: { locations, locationIds, results } },
  }
}
