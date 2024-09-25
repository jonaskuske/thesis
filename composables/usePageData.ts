import { type ComputedRef, computed } from 'vue'
import { usePageContext } from './usePageContext.ts'

export function usePageData<Data>(): ComputedRef<Data> {
  const ctx = usePageContext()

  const data = computed(() => ctx.data.value as Data)
  return data
}
