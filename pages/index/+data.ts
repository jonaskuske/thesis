import cities from 'zip-to-city/germany.json'
import * as store from '../../utils/cookies'
import type { PageContextServer } from 'vike/types'

export type Data = {
  search: string
  results: typeof cities
  locationIds: Set<string>
  locations: typeof cities
}

export async function data({ cookies, urlParsed }: PageContextServer): Promise<Data> {
  const locationIds = new Set(store.get('location_ids', cookies) ?? [])

  const locations = [...locationIds]
    .map((id) => cities.find((city) => city.id === id))
    .filter((city): city is (typeof cities)[0] => city != null)

  const search = (urlParsed.search?.location?.toLowerCase() ?? '').trim()
  const results = search
    ? cities.filter(
        ({ city, zip }) => city.toLowerCase().startsWith(search) || zip.startsWith(search),
      )
    : []

  return { search, locations, locationIds, results }
}
