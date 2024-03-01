import type { OnBeforeRenderSync } from 'vike/types'

const onBeforeRender: OnBeforeRenderSync = (pageContext): ReturnType<OnBeforeRenderSync> => {
  return {
    pageContext: {
      headerTitle: pageContext.is404 ? '404' : 'Error',
    },
  }
}

export { onBeforeRender }
