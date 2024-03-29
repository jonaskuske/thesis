import type { OnPageTransitionEndAsync } from 'vike/types'

export const onPageTransitionEnd: OnPageTransitionEndAsync = async (
  pageContext,
): ReturnType<OnPageTransitionEndAsync> => {
  document.body.classList.remove('page-transition')
}
