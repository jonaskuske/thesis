import { type ObjectDirective } from 'vue'
import { applyStickyObserver, type StickyObserverDirection } from '../utils/applyStickyObserver'

export const vSticky: ObjectDirective<HTMLElement & { __stickyObs?: IntersectionObserver }> = {
  mounted(el, { arg }) {
    el.__stickyObs = applyStickyObserver(el, arg as StickyObserverDirection)
  },
  unmounted(el) {
    el.__stickyObs?.disconnect()
  },
  getSSRProps(binding) {
    return { 'v-sticky': binding.arg ?? '' }
  },
}
