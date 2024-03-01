<script setup lang="ts">
import { computed } from 'vue'
import type { Data } from './+data'
import Calendar from '../../../components/icons/Calendar.vue'
import Clock from '../../../components/icons/Clock.vue'
import { usePageContext } from '../../../composables/usePageContext'

const ctx = usePageContext()
const props = defineProps<{ sighting: Data['sightings'][0] }>()
const date = computed(() => new Date(props.sighting.date))

const dateString = computed(() => date.value.toLocaleDateString(ctx.language.value))
const timeString = computed(() =>
  date.value.toLocaleTimeString(ctx.language.value, { hour: '2-digit', minute: '2-digit' }),
)
</script>

<template>
  <div class="next-sighting-card">
    <p class="date"><Calendar width="32" class="icon" />{{ dateString }}</p>
    <p class="time"><Clock width="32" class="icon" />{{ timeString }}</p>
    <p class="iss-position">The ISS will pass you at 74° NNE.</p>
    <p class="temperature">
      Temperature is forecasted to be at {{ props.sighting.weather.temperature }}° and skies will be
      clear.
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
