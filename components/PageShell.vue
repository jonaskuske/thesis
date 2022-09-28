<script lang="ts" setup>
import { nextTick } from 'vue'
import Link from '../components/Link.vue'

import { isServer } from '../utils'

import { usePageContext } from '../composables/usePageContext'
import type { PageContextServer } from '../utils/types'

// force full rerender in shell (comes from cache) to fix hydration mismatches
let rerenderKey = $ref(0)
void nextTick().then(() => rerenderKey++)

let contentOnly = $ref(false)

if (isServer) {
  const ctx = usePageContext<PageContextServer>()
  contentOnly = ctx.contentOnly
}
</script>

<template>
  <div v-if="contentOnly" class="content"><slot /></div>

  <div v-else class="layout">
    <div :key="rerenderKey" class="navigation">
      <Link href="/about">About</Link>
      <Link href="/settings">Einstellungen</Link>
    </div>
    <div class="content"><slot /></div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=block');

.sr-only {
  clip: rect(0, 0, 0, 0);
  border-width: 0;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

html {
  width: 100%;
  height: 100%;
}
body {
  margin: 0;
}
body,
#app {
  display: flex;
  flex-direction: column;
  min-height: -webkit-fill-available;
  min-height: 100dvh;
  flex-grow: 1;
}
#app {
  font-family: 'Space Grotesk', sans-serif;
  color: #fff;
  background: linear-gradient(177.54deg, #06002c 21.39%, #45017b 142.67%) no-repeat;
}
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
  color: inherit;
}
button {
  all: unset;
}
h1 {
  margin-block: 0;
}
h2 {
  font-size: 24px;
  font-weight: 400;
}
</style>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  flex-grow: 1;
  width: 100%;
}
.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  margin-top: 16px;
}
.navigation {
  display: flex;
  width: 100%;
  padding: 20px;
  padding-top: 50px;
  order: 1;
  margin-top: auto;
  justify-content: center;
}
</style>
