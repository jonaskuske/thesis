<script lang="ts">
import { isServer } from '../utils'
import type { OnBeforeRender } from '../utils/types'

export let onBeforeRender: OnBeforeRender

if (isServer) {
  onBeforeRender = function (pageContext) {
    const headerTitle = pageContext.is404 ? '404' : '500'

    return {
      pageContext: { headerTitle },
    }
  }
}
</script>

<script lang="ts" setup>
import { usePageContext } from '../composables/usePageContext'

const { is404 } = usePageContext()
</script>

<template>
  <p v-if="is404">Die aufgerufene Seite existiert nicht.</p>
  <p v-else>Ein Fehler ist aufgetreten.</p>
</template>
