export type StickyObserverDirection = 'top' | 'bottom' | 'left' | 'right' | '' | null | undefined

export function applyStickyObserver(el: HTMLElement, dir: StickyObserverDirection) {
  el.style.position = 'sticky'
  el.style[dir || 'top'] = '-1px'

  const observer = new IntersectionObserver(
    ([entry]) => el.classList.toggle('v-sticky', !entry.isIntersecting),
    { threshold: [1] },
  )

  observer.observe(el)

  return observer
}
