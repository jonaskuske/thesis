<script setup lang="ts">
import { computed } from 'vue'
import Link from '../../components/Link.vue'
import Cloud from '../../components/icons/Cloud.vue'
import Calendar from '../../components/icons/Calendar.vue'
import Clock from '../../components/icons/Clock.vue'
import { usePageContext } from '../../composables/usePageContext.ts'

const ctx = usePageContext()

const { location } = defineProps<{
  location: { id: string; city: string; sightings: string[] }
}>()

const dates = computed(() =>
  location.sightings.map((dateString) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(ctx.language.value),
      time: date.toLocaleTimeString(ctx.language.value, { hour: '2-digit', minute: '2-digit' }),
    }
  }),
)
</script>

<template>
  <div class="city">
    <div class="city-head">
      <Link class="city-name" :href="`/locations/${location.id}`">{{ location.city }}</Link>
      <p class="city-weather">14°C <Cloud class="icon-weather" /></p>
    </div>
    <div>
      <p class="city-date"><Calendar class="icon-date" /> {{ dates[0]?.date ?? '-' }}</p>
      <p class="city-time"><Clock class="icon-time" /> {{ dates[0]?.time ?? '-' }}</p>
    </div>
  </div>
</template>

<style scoped>
.city {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 12px;
  background: rgba(108, 91, 216, 0.2);
  box-shadow: 0px 0px 6px 2px rgba(164, 164, 164, 0.25);
  border-radius: 8px;
}

.city-head {
  display: flex;
  justify-content: space-between;
}

.city-name {
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
.city-weather {
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  margin: 0;
}

.icon-weather {
  display: inline;
  vertical-align: top;
  width: 1rem;
  height: 1rem;
}

.city-date,
.city-time {
  font-size: 24px;
  font-weight: 400;
  line-height: 31px;
  letter-spacing: 0em;
  margin: 0;
  display: flex;
}
.city-date {
  margin-bottom: 4px;
}

.icon-date,
.icon-time {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 6px;
}
</style>
