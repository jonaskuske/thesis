<script lang="ts" setup>
import { useAttrs } from 'vue'
import { usePageContext } from '../composables/usePageContext'

const attrs = useAttrs()
const ctx = usePageContext()
</script>

<template>
  <a :class="{ active: attrs.href === ctx.urlPathname }">
    <slot />
  </a>
</template>

<style scoped>
a {
  color: inherit !important;
  padding: 3px 10px;
}
</style>
