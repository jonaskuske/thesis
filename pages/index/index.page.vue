<script lang="ts">
import { isServer } from '../../utils'
import type { OnBeforeRender } from '../../utils/types'
import cities from 'zip-to-city/germany.json'
import * as store from '../../utils/cookies'

type Data = {
  search: string
  results: typeof cities
  locationIds: Set<string>
  locations: typeof cities
}

export let onBeforeRender: OnBeforeRender<Data>

if (isServer) {
  onBeforeRender = function ({ cookies, urlParsed }) {
    const locationIds = new Set(store.get('location_ids', cookies) ?? [])

    const locations = [...locationIds]
      .map((id) => cities.find((city) => city.id === id))
      .filter((city): city is typeof cities[0] => city != null)

    const search = (urlParsed.search?.location?.toLowerCase() ?? '').trim()
    const results = search
      ? cities.filter(
          ({ city, zip }) => city.toLowerCase().startsWith(search) || zip.startsWith(search),
        )
      : []

    return {
      pageContext: { data: { search, locations, locationIds, results } },
    }
  }
}
</script>

<script setup lang="ts">
import { watch } from 'vue'
import { usePageData } from '../../composables/usePageData'
import LocationList from './LocationList.vue'
import Search from '../../components/icons/Search.vue'

let { search, results, locationIds, locations } = $(usePageData<Data>())

watch($$(search), (search, _, onCleanup) => {
  let abortHandler = new AbortController()

  if (!search.length) results = []
  else {
    void fetch(`/cities?search=${search}`, { signal: abortHandler.signal })
      .then((response) => response.json())
      .then((cityResults: typeof cities) => (results = cityResults))
  }

  onCleanup(() => abortHandler.abort())
})

watch(
  $$(locationIds),
  (ids, _, onCleanup) => {
    const abortHandler = new AbortController()

    void fetch(`/cities?include=${[...ids].join(',')}`, { signal: abortHandler.signal })
      .then((response) => response.json())
      .then((cityResults: typeof cities) => (locations = cityResults))
      .then(() => store.set('location_ids', [...ids]))
      .then(() => (search = ''))

    onCleanup(() => abortHandler.abort())
  },
  { deep: true },
)
</script>

<template>
  <form class="search-form" @submit.prevent>
    <div class="input-wrapper">
      <Search />
      <input
        id="location-input"
        v-model.trim="search"
        placeholder=" "
        class="input"
        type="search"
        name="location"
      />
      <label for="location-input" class="label">Ort hinzufügen</label>
    </div>
    <button type="submit" class="sr-only">Suchen</button>
  </form>
  <LocationList
    v-if="!search"
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
    <p>Keine Ergebnisse für „{{ search }}“.</p>
  </template>
</template>

<style scoped>
h1,
.search-form {
  width: 100%;
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
