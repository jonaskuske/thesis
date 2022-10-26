<script lang="ts" setup>
import { usePageContext } from '../composables/usePageContext'

const { is404 } = usePageContext()
</script>

<template>
  <p v-if="is404">Die aufgerufene Seite existiert nicht.</p>
  <p v-else>Ein Fehler ist aufgetreten.</p>
</template>
