import { type ComputedRef, computed } from 'vue'
import { usePageContext } from './usePageContext'

export function usePageData<Data>(): ComputedRef<Data> {
  const ctx = usePageContext()

  const data = computed(() => ctx.data as Data)
  return data
}
