import { computed } from 'vue'
import { usePageContext } from './usePageContext.ts'

export function useTitle() {
  const { title, config } = usePageContext()

  return computed(() => config?.value?.title ?? title?.value ?? 'ISS Tracker')
}
