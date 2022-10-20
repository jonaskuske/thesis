import { useIsHome } from './useIsHome'
import { usePageContext } from './usePageContext'

export function useTitle() {
  const isHome = $(useIsHome())
  const ctx = usePageContext()

  const title = $computed(() =>
    isHome ? 'ISS Tracker' : ((ctx.exports.headerTitle || ctx.headerTitle) as string),
  )

  return $$(title)
}
