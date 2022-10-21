<script setup lang="ts">
import { watch } from 'vue'
import LocationList from './LocationList.vue'
import type cities from 'zip-to-city/germany.json'
import type { ReactiveVariable } from 'vue/macros'
import { useCookies } from '../../composables/useCookies'

import { usePageContext } from '../../composables/usePageContext'

const ctx = usePageContext()

let search = $ref(ctx.urlParsed.search?.location ?? '')
let results: ReactiveVariable<typeof cities> = $ref(ctx.pageProps?.results || [])

const [get, setCookie] = useCookies()

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

let locationIds = $ref(
  (ctx.pageProps?.locationIds ||
    new Set(JSON.parse((await get('locations')) || '[]'))) as Set<string>,
)

let locations = $ref((ctx.pageProps?.locations || []) as typeof cities)

watch($$(locationIds), (ids, _, onCleanup) => {
  const abortHandler = new AbortController()

  void fetch(`/cities?include=${[...ids].join(',')}`)
    .then((response) => response.json())
    .then((cityResults: typeof cities) => (locations = cityResults))
    .then(() => setCookie('locations', JSON.stringify([...ids])))

  onCleanup(() => abortHandler.abort())
})
</script>

<template>
  <form class="search-form" @submit.prevent>
    <div class="input-wrapper">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
          fill="white"
        />
      </svg>

      <input
        id="location-input"
        v-model="search"
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
  <template v-else>
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
      <button type="submit" @click="locationIds.add(id), (search = '')">Hinzufügen</button>
    </form>
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
