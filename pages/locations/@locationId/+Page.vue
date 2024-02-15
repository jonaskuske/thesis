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
const expandedDate = ref(Number(urlParsed.search.expand || data.value.sightings[0]?.date))
</script>

<template>
  <div v-if="empty" class="container">
    <NoFlyOverGraphic class="img-no-sightings" />
    <h2>Keine Sichtungen prognostiziert</h2>
    <p>
      Leider sind für diesen Standort keine Sichtungen prognostiziert. Du kannst später noch mal
      vorbei schauen oder einen anderen Ort auswählen.
    </p>
  </div>
  <div v-else class="container">
    <form v-for="sighting in data.sightings" :key="sighting.date" class="sighting" method="get">
      <input type="hidden" name="expand" :value="sighting.date" />
      <ExpandedSightingCard v-if="expandedDate === sighting.date" :sighting="sighting" />
      <SightingCard v-else :sighting="sighting" />
      <button type="submit"><span class="sr-only">Auswählen</span></button>
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
