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

    <h2>No locations</h2>
    <p class="empty-text">
      To learn about upcoming ISS sightings, add a location via the search bar or use your current
      location.
    </p>
    <GeolocationButton @location="emit('location', $event)" />
  </div>
  <ul v-else class="list">
    <li v-for="location in locations" :key="location.id" class="list-item">
      <LocationCard :location="location" />
    </li>
  </ul>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
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
.list-item {
  align-self: stretch;
}
</style>
