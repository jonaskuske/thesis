<script lang="ts" setup>
defineProps<{ is404: boolean }>()
</script>

<template>
  <p v-if="is404">Die aufgerufene Seite existiert nicht.</p>
  <p v-else>Ein Fehler ist aufgetreten.</p>
</template>
