<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocationPermission } from '../composables/useGeolocationPermission'

const emit = defineEmits<{
  (e: 'location', address: Record<string, string>): void // eslint-disable-line
}>()

const { state } = useLocationPermission()

const isLoading = ref(false)
const isDisabled = computed(() => isLoading.value || state.value === 'denied')

const getLocation = () => {
  isLoading.value = true
  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude: lat, longitude: lon } }) => {
      void fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        .then((response) => response.json())
        .then(({ address }) => emit('location', address))
        .finally(() => (isLoading.value = false))
    },
    () => (isLoading.value = false),
  )
}
</script>

<template>
  <div class="geolocation-button">
    <button :aria-disabled="isDisabled" :disabled="isDisabled" type="button" @click="getLocation">
      {{ isLoading ? 'Standort wird abgerufen...' : 'Aktuellen Standort verwenden' }}
    </button>
    <p v-if="state === 'denied'">Standortzugriff in den Systemeinstellungen blockiert.</p>
  </div>
</template>

<style scoped>
.geolocation-button {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.geolocation-button button {
  padding: 8px 16px;
  background: #4d009c;
  color: inherit;
  box-shadow: 1px 2px 0px 2px #00000040;
  border-radius: 8px;
  user-select: none;
}
.geolocation-button button:active {
  background: #5d00b9;
}
.geolocation-button button:disabled {
  background: hsl(240, 8%, 53%);
  color: #ffffffaa;
}
.geolocation-button p {
  font-size: 12px;
}
</style>