<script setup lang="ts">
import { watchEffect } from 'vue'
import LocationList from './LocationList.vue'
import cities from 'zip-to-city/germany.json'
import type { ReactiveVariable } from 'vue/macros'
import { useCookies } from '../../composables/useCookies'
import { isServer } from '../../utils'

let search = $ref('')
let results: ReactiveVariable<typeof cities> = $ref([])

const [get, set] = useCookies()

watchEffect(() => {
  if (!search.length) results = []
  else {
    const lowercasedSearch = search.toLowerCase()
    results = cities.filter(
      ({ city, zip }) =>
        city.toLowerCase().startsWith(lowercasedSearch) ||
        zip.toLowerCase().startsWith(lowercasedSearch),
    )
  }
})

const initialData = (await get('locations')) || '[]'
let locationIds: Set<string> = $ref(new Set(JSON.parse(initialData) as string[]))

const locations = $computed(() => [...locationIds].map((id) => cities.find((c) => c.id === id)!))

if (!isServer) {
  watchEffect(() => {
    void set('locations', JSON.stringify([...locationIds]))
  })
}
</script>

<template>
  <form action="" @submit.prevent>
    <div class="input-wrapper">
      <label :style="{ opacity: +!search }" for="location-input" class="label"
        >Ort hinzufügen</label
      >
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

      <input id="location-input" v-model="search" class="input" type="search" name="location" />
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
    <div v-for="{ city, zip, id } in results" :key="id" class="city">
      <p class="result-name">{{ zip }} {{ city }}</p>
      <button @click="locationIds.add(id), (search = '')">Hinzufügen</button>
    </div>
  </template>
</template>

<style scoped>
h1,
form {
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
.result-name {
  font-weight: 700;
}
form {
  margin-bottom: 48px;
}
.list {
  align-self: center;
  margin-bottom: 16px;
}

form ~ * {
  align-self: center;
}
h2 + p {
  text-align: center;
}
.city {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
