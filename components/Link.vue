<script lang="ts" setup>
import { useAttrs } from 'vue'
import { usePageContext } from '../composables/usePageContext.ts'

const attrs = useAttrs()
const ctx = usePageContext()
</script>

<template>
  <a :class="{ active: attrs.href === ctx.urlPathname.value }">
    <slot />
  </a>
</template>

<style scoped>
a,
a:focus,
a:active,
a:visited {
  color: inherit;
}
</style>
