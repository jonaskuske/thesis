import { toRefs, watch, reactive } from 'vue'
import type { PageContextShared } from '../utils/types'
import { usePageContext } from './usePageContext'

export function usePageData<Data extends Record<string, unknown> = Record<string, unknown>>() {
  const { data } = $(usePageContext<PageContextShared<Data>>())

  const mutableData = reactive(data as Data)

  watch($$(data as Data), (newData) => {
    const newKeys = new Set(Object.keys(newData))

    for (const key of Object.keys(mutableData)) {
      if (!newKeys.has(key)) delete mutableData[key]
    }

    Object.assign(mutableData, newData)
  })

  return toRefs(mutableData)
}
