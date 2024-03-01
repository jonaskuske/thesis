import { computed } from 'vue'
import { usePageContext } from './usePageContext'

export function useTitle() {
  const { title, config } = usePageContext()

  return computed(() => title?.value ?? config?.value?.title ?? 'ISS Tracker')
}
