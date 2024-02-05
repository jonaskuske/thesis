<script setup lang="ts">
import EmptyGraphic from '../../components/EmptyGraphic.vue'
import Link from '../../components/Link.vue'
import GeolocationButton from '../../components/GeolocationButton.vue'

const { locations = [] } = defineProps<{ locations?: { id: string; city: string }[] }>()

const emit = defineEmits<{
  (e: 'location', address: Record<string, string>): void // eslint-disable-line
}>()
</script>

<template>
  <div v-if="locations.length === 0" class="list">
    <EmptyGraphic width="302" height="300" class="empty-img" />

    <h2>Keine Orte ausgewählt</h2>
    <p>
      Um Progonosen zur Sichtung der ISS zu bekommen, kannst du Orte über die Suche hinzufügen oder
      deinen aktuellen Standort verwenden.
    </p>
    <GeolocationButton class="geo-button" @location="emit('location', $event)" />
  </div>
  <div v-else>
    <div v-for="location in locations" :key="location.id" class="city">
      <Link class="link" :href="`/locations/${location.id}`">
        <p class="city-name">{{ location.city }}</p>
      </Link>
      <p class="city-other">Keine Informationen vorhanden.</p>
    </div>
  </div>
</template>

<style scoped>
p {
  margin: 0;
  max-width: 45ch;
  text-align: center;
}
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}
.link::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.city {
  position: relative;
  width: 100%;
  /* Auto layout */

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  gap: 12px;

  /* Card Color */
  background: rgba(108, 91, 216, 0.2);
  /* Drop Shadow */
  box-shadow: 0px 0px 6px 2px rgba(164, 164, 164, 0.25);
  border-radius: 8px;
}
.city-name {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 18px;
}
.city-other {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 31px;
}
.empty-img {
  margin-bottom: 16px;
}
.geo-button {
  align-self: center;
}
</style>
