import { computed } from 'vue'
import { useIsHome } from './useIsHome'
import { useIsShell } from './useIsShell'
import { usePageContext } from './usePageContext'

export function useTitle() {
  const isHome = useIsHome()
  const isShell = useIsShell()

  const { headerTitle, config } = usePageContext()

  return computed(() =>
    isHome.value || isShell.value
      ? 'ISS Tracker'
      : config?.value?.headerTitle ?? headerTitle?.value,
  )
}
