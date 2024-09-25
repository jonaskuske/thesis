import { computed, type Ref } from 'vue'
import { usePageContext } from './usePageContext.ts'

export function useIsHome(): Ref<boolean> {
  const ctx = usePageContext()

  return computed(() => ctx.urlPathname.value === '/')
}
