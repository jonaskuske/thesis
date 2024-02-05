<script setup lang="ts">
import { watch, ref } from 'vue'
import { usePageData } from '../../composables/usePageData'
import GeolocationButton from '../../components/GeolocationButton.vue'
import LocationList from './LocationList.vue'
import Search from '../../components/icons/Search.vue'
import type cities from 'zip-to-city/germany.json'
import * as store from '../../utils/cookies'
import type { Data } from './+data'

const data = usePageData<Data>()

const search = ref(data.value.search)
const results = ref(data.value.results)
const locations = ref(data.value.locations)
const locationIds = ref(data.value.locationIds)

watch(search, (search, _, onCleanup) => {
  let abortHandler = new AbortController()

  if (!search.length) results.value = []
  else {
    void fetch(`/cities?search=${search}`, { signal: abortHandler.signal })
      .then((response) => response.json())
      .then((cityResults: typeof cities) => (results.value = cityResults))
  }

  onCleanup(() => abortHandler.abort())
})

watch(
  locationIds,
  (ids, _, onCleanup) => {
    const abortHandler = new AbortController()

    void fetch(`/cities?include=${[...ids].join(',')}`, { signal: abortHandler.signal })
      .then((response) => response.json())
      .then((cityResults: typeof cities) => (locations.value = cityResults))
      .then(() => store.set('location_ids', [...ids]))
      .then(() => (search.value = ''))

    onCleanup(() => abortHandler.abort())
  },
  { deep: true },
)

const searchIsFocused = ref(false)
</script>

<template>
  <TransitionGroup>
    <form key="search" class="search-form" @submit.prevent>
      <div class="input-wrapper">
        <Search />
        <input
          id="location-input"
          v-model.trim="search"
          placeholder=" "
          class="input"
          type="search"
          name="location"
          @focus="searchIsFocused = true"
          @blur="searchIsFocused = false"
        />
        <label for="location-input" class="label">Ort hinzufügen</label>
      </div>
      <button type="submit" class="sr-only">Suchen</button>
      <GeolocationButton
        v-show="search.length || (locations.length && searchIsFocused)"
        class="button-location"
        @location="search = $event.postcode"
      />
    </form>
    <LocationList
      v-if="!search"
      key="locations"
      :locations="locations"
      class="list"
      @location="search = $event.postcode"
    />
    <template v-else-if="results.length">
      <form
        v-for="{ city, zip, id } in results"
        :key="id"
        method="post"
        action="/locations"
        class="city"
        @submit.prevent
      >
        <p class="result-name">{{ zip }} {{ city }}</p>
        <input type="hidden" name="id" :value="id" />
        <button type="submit" @click="locationIds.add(id)">Hinzufügen</button>
      </form>
    </template>
    <template v-else>
      <p key="no-results">Keine Ergebnisse für „{{ search }}“.</p>
    </template>
  </TransitionGroup>
</template>

<style scoped>
.v-move {
  transition: transform 200ms ease;
}

h1,
.search-form {
  width: 100%;
}
.search-form {
  display: flex;
  flex-direction: column;
}
.button-location {
  align-self: center;
  margin-top: 12px;
}

.input-wrapper {
  display: flex;
  position: relative;
  align-items: center;
  background: rgba(101, 101, 101, 0.45);
  border-radius: 8px;
  padding: 8px;
}
.label {
  position: absolute;
  display: flex;
  align-items: center;
  inset: 0;
  left: 34px;
  pointer-events: none;
}
.input {
  all: unset;
  margin-left: 8px;
  width: 100%;
}
.input:not(:placeholder-shown) + label {
  opacity: 0;
}
.result-name {
  font-weight: 700;
}
.search-form {
  margin-bottom: 48px;
}
.list {
  align-self: center;
  margin-bottom: 16px;
}

.search-form ~ * {
  align-self: center;
}
h2 + p {
  text-align: center;
}
.city {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 0;
}
</style>
