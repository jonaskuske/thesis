import { render } from 'vike/abort'
import type { OnBeforeRenderSync } from 'vike/types'
import cities from 'zip-to-city/germany.json' with { type: 'json' }

const onBeforeRender: OnBeforeRenderSync = (pageContext): ReturnType<OnBeforeRenderSync> => {
  const id = pageContext.routeParams.locationId
  const city = cities.find((c) => c.id === id)?.city

  if (!city) {
    throw render(404)
  }

  return {
    pageContext: {
      title: city,
    },
  }
}

export { onBeforeRender }
