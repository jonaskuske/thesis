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
  <div class="sighting-card">
    <p class="date"><Calendar class="icon" width="24" />{{ dateString }}</p>
    <p class="time"><Clock class="icon" width="24" />{{ timeString }}</p>
  </div>
</template>

<style scoped>
.sighting-card {
  box-shadow: 0px 0px 6px 2px rgba(164, 164, 164, 0.25);
  background: rgba(108, 91, 216, 0.2);
  padding: 24px;
  border-radius: 8px;
}
.date,
.time {
  margin: 0;
  font-size: 24px;
  font-weight: 400;
  line-height: 31px;
  letter-spacing: 0em;
  text-align: left;
  display: flex;
  align-items: center;
}
.date {
  margin-bottom: 0.25rem;
}
.icon {
  margin-right: 0.5em;
}
</style>
