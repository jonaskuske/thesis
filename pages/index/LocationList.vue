<script setup lang="ts">
import { onServerPrefetch } from 'vue'
import EmptyGraphic from '../../components/EmptyGraphic.vue'
import { wait } from '../../utils'

const locations = $ref([])

onServerPrefetch(async () => {
  // to simulate data loading
  await wait(0)
})
</script>

<template>
  <div v-if="locations.length === 0" class="list">
    <EmptyGraphic width="302" height="300" class="empty-img" />

    <h2>Keine Orte ausgewählt</h2>
    <p>
      Um Progonosen zur Sichtung der ISS zu bekommen, kannst du Orte über die Suche hinzufügen oder
      deinen aktuellen Standort verwenden.
    </p>
  </div>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
