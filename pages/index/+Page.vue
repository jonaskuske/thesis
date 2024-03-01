<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import { reload } from 'vike/client/router'
import { usePageData } from '../../composables/usePageData'
import GeolocationButton from '../../components/GeolocationButton.vue'
import LocationList from './LocationList.vue'
import Search from '../../components/icons/Search.vue'
import SearchResult from './SearchResult.vue'
import type cities from 'zip-to-city/germany.json'
import type { Data } from './+data'
import * as cookies from '../../utils/cookies'

const data = usePageData<Data>()

const search = ref(data.value.search)
const results = ref(data.value.results)
const locations = computed(() => data.value.locations)
const locationIds = computed(() => data.value.locationIds)

const isMPA = import.meta.env.PUBLIC_ENV__MODE === 'MPA'

watch(search, (search, _, onCleanup) => {
  let abortHandler = new AbortController()

  if (!search.length) results.value = []
  else {
    void fetch(`/cities?search=${search}&limit=20`, { signal: abortHandler.signal })
      .then((response) => response.json())
      .then((cityResults: typeof cities) => (results.value = cityResults))
  }

  onCleanup(() => abortHandler.abort())
})

const isLoading = ref(false)
const searchIsFocused = ref(false)
const handleBlur = () => setTimeout(() => (searchIsFocused.value = false), 100)

async function addLocation(id: string) {
  const nextLocationIds = new Set(locationIds.value)
  nextLocationIds.add(id)
  await cookies.set('location_ids', [...nextLocationIds])

  await reload()
  search.value = ''
}
</script>

<template>
  <TransitionGroup>
    <form
      key="search"
      class="search-form"
      :class="{ hasLocations: locations.length, isMPA: isMPA }"
      @submit.prevent
    >
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
          @blur="handleBlur"
        />
        <label for="location-input" class="label">Add location</label>
      </div>
      <button type="submit" class="sr-only">Search</button>
      <GeolocationButton
        v-show="search.length || isLoading || (locations.length && searchIsFocused)"
        class="button-location"
        @location="search = $event.postcode"
        @loading="isLoading = $event"
      />
    </form>
    <LocationList
      v-show="!search"
      key="locations"
      :locations="locations"
      class="list"
      @location="search = $event.postcode"
    />
    <div v-show="search && results.length" key="results" class="results">
      <SearchResult
        v-for="city in results"
        :key="city.id"
        :city="city"
        @submit.prevent="addLocation(city.id)"
      />

      <template v-if="isMPA">
        <template id="result-template">
          <SearchResult key="tpl" :city="{ zip: '_zip_', city: '_city_', id: '' }" />
        </template>
      </template>
    </div>
    <p v-show="search && !results.length" key="no-results" class="no-results">
      No results for "{{ search }}".
    </p>
  </TransitionGroup>
</template>

<style scoped>
.search-form.isMPA.hasLocations:focus-within .geolocation-button,
.search-form.isMPA .geolocation-button[data-loading='true'] {
  display: flex !important;
}
.v-move {
  transition: transform 200ms ease;
}
.v-enter-active,
.v-leave-active {
  transition: none;
}

.results {
  width: 100%;
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
</style>
