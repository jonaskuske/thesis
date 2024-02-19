import { computed, ref, nextTick, onMounted, type Ref } from 'vue'
import { useIsPageShell } from './useIsPageShell'
import { usePageContext } from './usePageContext'

const isHomePath = (urlPathname: string) => urlPathname === '/' || urlPathname === '/_shell'

export function useIsHome(): Ref<boolean> {
  const { enableHydration, urlPathname } = usePageContext()
  const isPageShell = useIsPageShell()

  const isHome = computed(() => isHomePath(urlPathname.value))

  if (isPageShell && enableHydration.value && import.meta.env.PUBLIC_ENV__DISABLE_SW !== 'true') {
    const mounted = ref(false)
    onMounted(() => void nextTick(() => (mounted.value = true)))

    return computed(() => (mounted.value ? isHome.value : true))
  }

  return isHome
}
