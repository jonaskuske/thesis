<template>
  <div v-if="contentOnly" class="content"><slot /></div>

  <div v-else class="layout">
    <div :key="rerenderKey" class="navigation">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </div>
    <div class="content"><slot /></div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import Link from '../components/Link.vue'

import { isServer } from '../utils'

import { usePageContext } from '../composables/usePageContext'
import type { PageContextServer } from '../utils/types'

// force full rerender in shell (comes from cache) to fix hydration mismatches
let rerenderKey = ref(0)
void nextTick().then(() => rerenderKey.value++)

let contentOnly = ref(false)

if (isServer) {
  const ctx = usePageContext<PageContextServer>()
  contentOnly.value = ctx.contentOnly
}
</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
}
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
</style>

<style scoped>
.content {
  padding: 20px;
  border-left: 2px solid #eee;
  padding-bottom: 50px;
  min-height: 10 0vh;
}
.layout {
  display: flex;
  max-width: 900px;
  margin: auto;
}
.navigation {
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.8em;
}
</style>
