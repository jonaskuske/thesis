<script setup lang="ts">
import { computed } from 'vue'
import type { Data } from './+data'
import Calendar from '../../../components/icons/Calendar.vue'
import Clock from '../../../components/icons/Clock.vue'

const props = defineProps<{ sighting: Data['sightings'][0] }>()
const date = computed(() => new Date(props.sighting.date))

const dateString = computed(() => date.value.toLocaleDateString('de-DE'))
const timeString = computed(() =>
  date.value.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
)
</script>

<template>
  <div class="next-sighting-card">
    <p class="date"><Calendar width="32" class="icon" />{{ dateString }}</p>
    <p class="time"><Clock width="32" class="icon" />{{ timeString }} Uhr</p>
    <p class="iss-position">Die ISS wird in einer Höhe von 74° in NNO vorbei fliegen.</p>
    <p class="temperature">
      Die Temperatur wird voraussichtlich {{ props.sighting.weather.temperature }}° betragen und der
      Himmel wird klar sein.
    </p>
  </div>
</template>

<style scoped>
.next-sighting-card {
  box-shadow: 0px 0px 6px 2px rgba(164, 164, 164, 0.25);
  background: rgba(108, 91, 216, 0.2);
  padding: 24px;
  border-radius: 8px;
}
.date,
.time,
.iss-position,
.temperature {
  margin: 0;
}
.date,
.time {
  font-family: 'Space Grotesk';
  font-size: 32px;
  font-weight: 700;
  line-height: 41px;
  letter-spacing: 0em;
  text-align: left;
  display: flex;
  align-items: center;
}
.date {
  margin-bottom: 0.75rem;
}
.icon {
  margin-right: 0.375em;
}
.iss-position {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
</style>
