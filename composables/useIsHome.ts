import { computed, ref, nextTick, onMounted, type Ref } from 'vue'
import { useIsPageShell } from './useIsPageShell'
import { usePageContext } from './usePageContext'

const isHomePath = (urlPathname: string) => urlPathname === '/' || urlPathname === '/_shell'

export function useIsHome(): Ref<boolean> {
  const { urlPathname } = usePageContext()
  const isPageShell = useIsPageShell()

  const isHome = computed(() => isHomePath(urlPathname.value))

  // While hydrating the app shell, pretend we're on the /root page, then adjust after mount
  if (
    import.meta.env.PUBLIC_ENV__MODE !== 'MPA' &&
    import.meta.env.PUBLIC_ENV__APP_SHELL === 'true' &&
    isPageShell &&
    (urlPathname.value === '/_shell' ||
      (typeof document !== 'undefined' && document.documentElement.dataset.appShell === 'true'))
  ) {
    const mounted = ref(false)
    onMounted(() => void nextTick(() => (mounted.value = true)))

    return computed(() => (mounted.value ? isHome.value : true))
  }

  return isHome
}
