<template>
  <div v-if="content_only === 'true'" class="content"><slot /></div>
  <div v-else class="layout">
    <div class="navigation">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </div>
    <div v-if="shell_only !== 'true'" class="content"><slot /></div>
    <template v-else><!--MARKER--></template>
  </div>
</template>

<script lang="ts" setup>
import Link from './Link.vue'
import { usePageContext } from './usePageContext'

const ctx = usePageContext()
const { content_only, shell_only } = ctx.urlParsed.search
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
.layout {
  display: flex;
  max-width: 900px;
  margin: auto;
}
.content {
  padding: 20px;
  border-left: 2px solid #eee;
  padding-bottom: 50px;
  min-height: 100vh;
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
