<script lang="ts" setup>
import { usePageContext } from '../../composables/usePageContext.ts'

const { is404 } = usePageContext()
</script>

<template>
  <p v-if="is404">The requested page does not exist.</p>
  <p v-else>An error occured.</p>
</template>
