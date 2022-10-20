import { inject, provide, type InjectionKey } from 'vue'

const IsPageShell: InjectionKey<boolean> = Symbol('isPageShell')

export function useIsPageShell() {
  return inject(IsPageShell, true)
}

export function markPageShellEnd() {
  provide(IsPageShell, false)
}
