<script lang="ts" setup>
import type cities from 'zip-to-city/germany.json'

const props = defineProps<{ city: Pick<(typeof cities)[0], 'id' | 'zip' | 'city'> }>()

const emit = defineEmits<{
  (e: 'submit', event: SubmitEvent): void
}>()
</script>

<template>
  <form
    method="post"
    action="/locations"
    class="city"
    @submit="emit('submit', $event as SubmitEvent)"
  >
    <p class="result-name">{{ props.city.zip }} {{ props.city.city }}</p>
    <input type="hidden" name="id" :value="props.city.id" />
    <button type="submit">Hinzufügen</button>
  </form>
</template>

<style scoped>
.city {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  content-visibility: auto;
  contain-intrinsic-size: 0 60px;
}

.result-name {
  font-weight: 700;
}
</style>
