import type { OnBeforeRenderSync } from 'vike/types'

const onBeforeRender: OnBeforeRenderSync = (pageContext): ReturnType<OnBeforeRenderSync> => {
  return {
    pageContext: {
      title: pageContext.is404 ? '404' : 'Error',
    },
  }
}

export { onBeforeRender }
