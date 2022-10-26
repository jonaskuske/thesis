import { computed, nextTick, onMounted, type Ref } from 'vue'
import { useIsPageShell } from './useIsPageShell'
import { usePageContext } from './usePageContext'

const isHomePath = (urlPathname: string) => urlPathname === '/' || urlPathname === '/_shell'

export function useIsHome(): Ref<boolean> {
  const { enableHydration, urlPathname } = $(usePageContext())
  const isPageShell = useIsPageShell()

  const isHome = $computed(() => isHomePath(urlPathname))

  if (isPageShell && enableHydration) {
    let mounted = $ref(false)
    onMounted(() => void nextTick(() => (mounted = true)))

    return computed(() => (mounted ? isHome : true))
  }

  return $$(isHome)
}
