<script setup lang="ts">
import EmptyGraphic from '../../components/EmptyGraphic.vue'
import GeolocationButton from '../../components/GeolocationButton.vue'
import LocationCard from './LocationCard.vue'

const { locations = [] } = defineProps<{
  locations?: { id: string; city: string; sightings: string[] }[]
}>()

const emit = defineEmits<{
  (e: 'location', address: Record<string, string>): void
}>()
</script>

<template>
  <div v-if="locations.length === 0" class="list">
    <EmptyGraphic width="302" height="300" class="empty-img" />

    <h2>Keine Orte ausgewählt</h2>
    <p class="empty-text">
      Um Progonosen zur Sichtung der ISS zu bekommen, kannst du Orte über die Suche hinzufügen oder
      deinen aktuellen Standort verwenden.
    </p>
    <GeolocationButton class="geo-button" @location="emit('location', $event)" />
  </div>
  <ul v-else class="list">
    <li v-for="location in locations" :key="location.id" class="city">
      <LocationCard :location="location" />
    </li>
  </ul>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}
.empty-img {
  margin-bottom: 16px;
}
.empty-txt {
  margin: 0;
  max-width: 45ch;
  text-align: center;
}
.geo-button {
  align-self: center;
}
</style>
