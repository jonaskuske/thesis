<script lang="ts" setup>
import Content from './Content.vue'
import Link from './Link.vue'
import ArrowLeft from './icons/ArrowLeft.vue'
import Cog from './icons/Cog.vue'
import Home from './icons/Home.vue'
import Map from './icons/Map.vue'
import { usePageContext } from '../composables/usePageContext'
import { useIsHome } from '../composables/useIsHome'
import { useTitle } from '../composables/useTitle'
import { vSticky } from '../directives/v-sticky'
import { computed } from 'vue'
import { isServer } from '../utils/index'

const ctx = usePageContext()
const contentOnly = isServer ? ctx.contentOnly : false

const isHome = useIsHome()

const title = useTitle()

const editHref = computed(() => {
  if (isHome.value) return false

  return /^\/locations\/\d+$/.test(ctx.urlPathname.value) && `${ctx.urlPathname.value}/edit`
})
</script>

<template>
  <Content v-if="contentOnly"><slot /></Content>

  <div v-else class="layout">
    <header v-sticky class="navigation">
      <div class="navigation-outer">
        <TransitionGroup tag="div" class="navigation-inner">
          <Link v-show="!isHome" key="back" class="back" href="/">
            <span class="sr-only">Zurück</span>
            <ArrowLeft class="navigation-icon" />
          </Link>
          <h1 key="title" class="title">
            <Transition mode="out-in">
              <span :key="title">{{ title }}</span>
            </Transition>
          </h1>
          <Link v-show="editHref" key="edit" :href="editHref" class="edit fill-current">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"
              x="0px"
              y="0px"
              viewBox="0 0 100 100"
              style="enable-background: new 0 0 100 100"
              xml:space="preserve"
            >
              <path
                d="M63.67,18.48c-0.78-0.78-2.05-0.78-2.83,0L23.68,55.64c-0.32,0.32-0.53,0.75-0.57,1.2l-1.7,16.04   c-0.06,0.6,0.15,1.2,0.57,1.62c0.38,0.38,0.89,0.59,1.41,0.59c0.07,0,0.14,0,0.21-0.01l16.04-1.7c0.46-0.05,0.88-0.25,1.2-0.58   l37.16-37.16c0.78-0.78,0.78-2.05,0-2.83L63.67,18.48z M38.53,69.48l-12.88,1.36l1.36-12.88l25.01-25.01l11.52,11.52L38.53,69.48z    M66.37,41.64L54.85,30.12l7.41-7.41l11.52,11.52L66.37,41.64z"
              />
              <path
                d="M59.21,82.11c1.1,0,2-0.9,2-2s-0.9-2-2-2H25.59c-1.1,0-2,0.9-2,2s0.9,2,2,2H59.21z"
              />
            </svg>
            <span class="sr-only">Bearbeiten</span>
          </Link>
        </TransitionGroup>
      </div>
    </header>
    <footer class="bottom-nav">
      <nav>
        <ul>
          <li>
            <Link class="nav-link" data-title="Home" href="/">
              <Home class="nav-icon" />
              <span class="sr-only">Home</span>
            </Link>
          </li>
          <li>
            <Link class="nav-link" data-title="Karte" href="/map">
              <Map class="nav-icon" />
              <span class="sr-only">Karte</span>
            </Link>
          </li>
          <li>
            <Link class="nav-link" data-title="Einstellungen" href="/settings">
              <Cog class="nav-icon" />
              <span class="sr-only">Einstellungen</span>
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
    <Content><slot /></Content>
  </div>
</template>

<style scoped>
nav ul li {
  flex-basis: 0;
  flex-grow: 1;
  display: flex;
  justify-content: center;
}
.nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nav-icon {
  width: 1.5rem;
  scale: 1.2;
  translate: 0 0.5em;
  transition:
    scale 150ms ease,
    transform 150ms ease;
}
.nav-link:hover .nav-icon,
.nav-link.active .nav-icon {
  scale: 0.9;
  translate: 0 -2px;
}
.nav-link::after,
.nav-link::after {
  content: '' attr(data-title);
  font-size: 0.8em;
  opacity: 0;
}
.nav-link:hover::after,
.nav-link.active::after {
  opacity: 0.99;
}

.edit {
  margin-left: auto;
  width: 40px;
  margin-bottom: -6px;
}
.layout {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 65px;
}

.navigation {
  z-index: 1;
  left: 0;

  &.v-sticky .navigation-outer {
    background: #06002c;
    transform: scaleY(0.65);

    &::after {
      opacity: 0.75;
      transition: opacity 150ms 100ms ease-in;
    }
  }
  &.v-sticky .navigation-inner {
    transform: scale(0.85, 1.3075);
  }
}
.navigation-outer {
  position: relative;
  transform-origin: top;

  &::after {
    content: '';
    position: absolute;
    pointer-events: none;
    inset: 0;
    opacity: 0;
    transition: opacity 100ms ease-out;
    box-shadow: 0 -2px 5px 0px #ffffff;
  }
}
.navigation-inner {
  padding: 20px;
  display: flex;
  align-items: center;
  transform-origin: left;
}
.navigation-outer,
.navigation-inner {
  transition: transform 200ms ease-out;
}
.navigation-icon {
  width: 2em;
}

.back {
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

.bottom-nav {
  position: fixed;
  background: #45017b;
  box-shadow: 0 0 5px 1px rgb(255 255 255 / 0.3);
  bottom: 0;
  left: 0;
  width: 100%;
  height: 65px;
  z-index: 1;
  & nav {
    height: 100%;
  }
  & ul {
    display: flex;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    justify-content: space-around;
    align-items: center;
    list-style: none;
    color: #fff;
  }
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
