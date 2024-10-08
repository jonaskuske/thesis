import { computed, type Ref } from 'vue'
import { usePageContext } from './usePageContext.ts'

export function useIsShell(): Ref<boolean> {
  const ctx = usePageContext()

  return computed(() => ctx.urlPathname.value === '/_shell')
}
