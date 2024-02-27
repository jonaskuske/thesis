import type { OnPageTransitionStartAsync } from 'vike/types'

export const onPageTransitionStart: OnPageTransitionStartAsync = async (
  pageContext,
): ReturnType<OnPageTransitionStartAsync> => {
  document.body.classList.add('page-transition')
}
