import { type Directive } from 'vue'

export const vSticky: Directive<HTMLElement & { __stickyObs?: IntersectionObserver }> = {
  mounted(el, { arg }) {
    el.style.position = 'sticky'
    el.style[(arg as 'top' | 'bottom' | 'left' | 'right') ?? 'top'] = '-1px'

    el.__stickyObs = new IntersectionObserver(
      ([entry]) => el.classList.toggle('v-sticky', !entry.isIntersecting),
      { threshold: [1] },
    )
    el.__stickyObs.observe(el)
  },
  unmounted(el) {
    el.__stickyObs?.disconnect()
  },
}
