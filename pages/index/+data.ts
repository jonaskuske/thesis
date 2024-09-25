import cities from 'zip-to-city/germany.json' with { type: 'json' }
import * as store from '../../utils/cookies.ts'
import type { PageContextServer } from 'vike/types'

export type Data = Awaited<ReturnType<typeof data>>

export async function data({ cookies, urlParsed }: PageContextServer) {
  const locationIds = new Set(store.get('location_ids', cookies) ?? [])

  const locations = [...locationIds]
    .map((id) => cities.find((city) => city.id === id))
    .filter((city): city is (typeof cities)[0] => city != null)

  const search = (urlParsed.search?.location?.toLowerCase() ?? '').trim()
  const results = search
    ? cities
        .filter(({ city, zip }) => city.toLowerCase().startsWith(search) || zip.startsWith(search))
        .slice(0, 20)
    : []

  const locationsWithSightingDates = locations.map((location) => {
    return {
      ...location,
      sightings: [new Date().toUTCString()],
    }
  })

  return { search, locations: locationsWithSightingDates, locationIds, results }
}
