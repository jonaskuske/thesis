<script setup lang="ts">
import { computed, ref } from 'vue'
import EmptyGraphic from '../../components/EmptyGraphic.vue'
import Link from '../../components/Link.vue'
import { useLocationPermission } from '../../composables/useGeolocationPermission'

const { locations = [] } = defineProps<{ locations?: { id: string; city: string }[] }>()

const emit = defineEmits<{
  (e: 'location', address: Record<string, string>): void // eslint-disable-line
}>()

const { state } = useLocationPermission()

let loading = ref(false)

const emitLocation = () => {
  loading.value = true
  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude: lat, longitude: lon } }) => {
      void fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        .then((response) => response.json())
        .then(({ address }) => emit('location', address))
        .finally(() => (loading.value = false))
    },
    () => (loading.value = false),
  )
}

const buttonDisabled = computed(() => loading.value || state.value === 'denied')
</script>

<template>
  <div v-if="locations.length === 0" class="list">
    <EmptyGraphic width="302" height="300" class="empty-img" />

    <h2>Keine Orte ausgewählt</h2>
    <p>
      Um Progonosen zur Sichtung der ISS zu bekommen, kannst du Orte über die Suche hinzufügen oder
      deinen aktuellen Standort verwenden.
    </p>
    <button
      :aria-disabled="buttonDisabled"
      :disabled="buttonDisabled"
      type="button"
      @click="emitLocation"
    >
      {{ loading ? 'Standort wird abgerufen...' : 'Aktuellen Standort verwenden' }}
    </button>
    <p v-if="state === 'denied'" style="font-size: 12px">
      Standortzugriff in den Systemeinstellungen blockiert.
    </p>
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
button[type='button'] {
  padding: 8px 16px;
  background: #4d009c;
  color: inherit;
  box-shadow: 1px 2px 0px 2px #00000040;
  border-radius: 8px;
  align-self: center;
  user-select: none;
}
button:active {
  background: #5d00b9;
}
button:disabled {
  background: hsl(240, 8%, 53%);
  color: #ffffffaa;
}
</style>
