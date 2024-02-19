import { computed } from 'vue'
import { useIsHome } from './useIsHome'
import { usePageContext } from './usePageContext'

export function useTitle() {
  const isHome = useIsHome()
  const { headerTitle, config } = usePageContext()

  return computed(() =>
    isHome.value ? 'ISS Tracker' : config?.value?.headerTitle ?? headerTitle?.value,
  )
}
