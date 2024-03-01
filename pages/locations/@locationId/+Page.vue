<script setup lang="ts">
import { computed, ref } from 'vue'
import NoFlyOverGraphic from '../../../components/NoFlyOverGraphic.vue'
import { usePageData } from '../../../composables/usePageData'
import type { Data } from './+data'
import ExpandedSightingCard from './ExpandedSightingCard.vue'
import SightingCard from './SightingCard.vue'
import { usePageContext } from '../../../composables/usePageContext'
const { urlParsed } = usePageContext()
const data = usePageData<Data>()

const empty = computed(() => data.value.sightings.length === 0)
const expandedDate = ref(Number(urlParsed.value.search.expand || data.value.sightings[0]?.date))
</script>

<template>
  <div v-if="empty" class="container">
    <NoFlyOverGraphic class="img-no-sightings" />
    <h2>No upcoming sightings</h2>
    <p>
      Unfortunately there aren't any upcoming sightings for this location. You can try again later
      or choose another location.
    </p>
  </div>
  <div v-else class="container">
    <form
      v-for="sighting in data.sightings"
      :key="sighting.date"
      class="sighting"
      method="get"
      @submit.prevent="expandedDate = sighting.date"
    >
      <input type="hidden" name="expand" :value="sighting.date" />
      <ExpandedSightingCard v-if="expandedDate === sighting.date" :sighting="sighting" />
      <SightingCard v-else :sighting="sighting" />
      <button type="submit"><span class="sr-only">Expand</span></button>
    </form>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.img-no-sightings {
  width: 300px;
  max-width: 100%;
  margin-top: 32px;
  align-self: center;
}
h2,
h2 + p {
  text-align: center;
}
.sighting {
  position: relative;
}
.sighting > button[type='submit'] {
  position: absolute;
  inset: 0;
}
</style>
