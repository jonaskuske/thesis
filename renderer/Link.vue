<template>
  <a :class="{ active: attrs.href === ctx.urlPathname }">
    <slot />
  </a>
</template>

<script lang="ts" setup>
import { useAttrs } from 'vue'
import { usePageContext } from './usePageContext'

const attrs = useAttrs()
const ctx = usePageContext()
</script>

<style scoped>
a {
  padding: 3px 10px;
}
a.active {
  background-color: #eee;
}
</style>
