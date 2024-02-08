<script lang="ts" setup>
import Content from './Content.vue'
import Link from './Link.vue'
import ArrowLeft from './icons/ArrowLeft.vue'
import { usePageContext } from '../composables/usePageContext'
import { useIsHome } from '../composables/useIsHome'
import { useTitle } from '../composables/useTitle'
import { vSticky } from '../directives/v-sticky'

const { contentOnly } = usePageContext()

const isHome = useIsHome()

const title = useTitle()
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
        </TransitionGroup>
      </div>
    </header>
    <footer class="bottom-nav">
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/map">Karte</Link></li>
          <li><Link href="/settings">Einstellungen</Link></li>
        </ul>
      </nav>
    </footer>
    <Content><slot /></Content>
  </div>
</template>

<style scoped>
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

.bottom-nav {
  position: fixed;
  background: #45017b;
  box-shadow: 0 0 5px 1px rgb(255 255 255 / 0.3);
  bottom: 0;
  left: 0;
  width: 100%;
  height: 65px;
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
