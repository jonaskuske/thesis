import { nextTick, onMounted, type Ref } from 'vue'
import { useIsPageShell } from './useIsPageShell'
import { usePageContext } from './usePageContext'

const isHomePath = (urlPathname: string) => urlPathname === '/' || urlPathname === '/_shell'

export function useIsHome(): Ref<boolean> {
  const { enableHydration, urlPathname } = usePageContext()
  const isPageShell = useIsPageShell()

  if (isPageShell && enableHydration) {
    let isHome = $ref(true)
    onMounted(() => void nextTick(() => (isHome = isHomePath(urlPathname))))
    return $$(isHome)
  }

  const isHome = $ref(isHomePath(urlPathname))

  return $$(isHome)
}
