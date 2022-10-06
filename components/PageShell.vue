<script lang="ts" setup>
import { nextTick, onMounted } from 'vue'
import Link from './Link.vue'
import Cog from './Cog.vue'

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

// @ts-ignore
if (!isServer) window.toggle = () => (isHome = !isHome)

onMounted(async () => {
  await nextTick()
  isHome = ctx.urlPathname === '/' || ctx.urlPathname === '/_shell'
})
</script>

<template>
  <div v-if="contentOnly" class="content"><slot /></div>

  <div v-else class="layout">
    <header class="navigation">
      <TransitionGroup>
        <Link v-if="!isHome" key="back" href="/">
          <svg
            width="32"
            height="33"
            viewBox="0 0 32 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 27.1667L5.33331 16.5L16 5.83337L17.9 7.70004L10.4333 15.1667H26.6666V17.8334H10.4333L17.9 25.3L16 27.1667Z"
              fill="white"
            />
          </svg>
        </Link>
        <h1 key="title">
          <Transition mode="out-in">
            <span :key="title">{{ title }}</span>
          </Transition>
        </h1>
        <Link key="cog" class="link-settings" href="/settings">
          <Cog style="fill: white; width: 26px" />
          <span class="sr-only">Einstellungen</span>
        </Link>
      </TransitionGroup>
    </header>
    <div class="content"><slot /></div>
  </div>
</template>

<style>
.v-move {
  transition: transform 350ms 700ms;
}
a.v-enter-from,
a.v-leave-to {
  opacity: 0;
}
a.v-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
}
a.v-enter-active {
  transition: opacity 150ms 800ms ease-in;
}
h1 .v-leave-to,
h1 .v-enter-from {
  opacity: 0;
}
h1 .v-leave-active {
  transition: opacity 180ms ease-out;
}
h1 .v-enter-active {
  transition: opacity 650ms ease-in;
}

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

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  margin: 0 auto;
}
a {
  vertical-align: bottom;
}
a svg {
  display: inline-block;
}
header {
  padding: 20px;
}
header h1,
header a {
  display: inline-block;
}
.link-settings {
  float: right;
  margin-top: 9px;
}
.content {
  display: flex;
  flex-direction: column;
  padding: 0 16px 24px;
}
</style>
