import { computed } from 'vue'
import { useIsHome } from './useIsHome'
import { usePageContext } from './usePageContext'

export function useTitle() {
  const isHome = $(useIsHome())
  const { exports, headerTitle } = $(usePageContext())

  return computed(() => (isHome ? 'ISS Tracker' : ((exports.headerTitle || headerTitle) as string)))
}
