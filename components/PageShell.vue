<script lang="ts" setup>
import { nextTick, onMounted } from 'vue'
import Link from './Link.vue'
import Cog from './icons/Cog.vue'
import ArrowLeft from './icons/ArrowLeft.vue'

import { isServer } from '../utils'

import { usePageContext } from '../composables/usePageContext'
import type { PageContextServer } from '../utils/types'

const ctx = usePageContext()

// force full rerender in shell (comes from cache) to fix hydration mismatches
let rerenderKey = $ref(0)
void nextTick().then(() => rerenderKey++)

let isHome = $ref(true)

const title = $computed(() => (isHome ? 'ISS Tracker' : (ctx.exports.headerTitle as string)))

const contentOnly = isServer && (ctx as PageContextServer).contentOnly

onMounted(async () => {
  await nextTick()
  isHome = ctx.urlPathname === '/' || ctx.urlPathname === '/_shell'
})
</script>

<template>
  <div v-if="contentOnly" class="content">
    <Suspense><slot /></Suspense>
  </div>

  <div v-else class="layout">
    <header class="navigation">
      <TransitionGroup>
        <Link v-show="!isHome" key="back" class="back" href="/">
          <span class="sr-only">Zurück</span>
          <ArrowLeft width="32" />
        </Link>
        <h1 key="title" class="title">
          <Transition mode="out-in">
            <span :key="title">{{ title }}</span>
          </Transition>
        </h1>
        <Link key="cog" class="settings" href="/settings">
          <Cog width="30" />
          <span class="sr-only">Einstellungen</span>
        </Link>
      </TransitionGroup>
    </header>
    <div class="content">
      <Suspense><slot /></Suspense>
    </div>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  padding: 0 16px 24px;
}

.layout {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  margin: 0 auto;
}

.navigation {
  display: flex;
  align-items: center;
  padding: 20px;
}

.back,
.settings {
  line-height: 0;
}

.back {
  margin-right: 6px;
  margin-left: -6px;
}
.back.v-move {
  transition: transform 1ms;
}
.back.v-enter-from,
.back.v-leave-to {
  opacity: 0;
}
.back.v-enter-active {
  transition: opacity 200ms 225ms ease-in;
}
.back.v-leave-active {
  position: absolute;
  visibility: hidden;
}

.title.v-move {
  transition: transform 450ms ease-out;
}
.title .v-leave-to,
.title .v-enter-from {
  opacity: 0;
}
.title .v-leave-active {
  transition: opacity 200ms 120ms ease-in;
}
.title .v-enter-active {
  transition: opacity 400ms ease-out;
}

.settings {
  margin-left: auto;
}
</style>

<style>
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

.fill-current {
  fill: currentColor;
}

html {
  height: 100%;
}
body {
  margin: 0;
}
h2 {
  margin-top: 0;
}
body,
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
  -webkit-tap-highlight-color: transparent;
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
