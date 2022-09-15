<template>
  <h1>ISS Tracker</h1>

  <form action="">
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
  <EmptyGraphic width="302" height="300" class="empty-img" />

  <h2>Keine Orte ausgewählt</h2>
  <p>
    Um Progonosen zur Sichtung der ISS zu bekommen, kannst du Orte über die Suche hinzufügen oder
    deinen aktuellen Standort verwenden.
  </p>
  <button type="button">Aktuellen Standort verwenden</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EmptyGraphic from '../../components/EmptyGraphic.vue'

const search = ref('')
</script>

<style scoped>
h1,
form {
  width: 100%;
}
form {
  margin-top: 16px;
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
}
.input {
  all: unset;
  margin-left: 8px;
  width: 100%;
}
.empty-img {
  margin-top: 48px;
}

button[type='button'] {
  padding: 8px 16px;
  background: #4d009c;
  color: inherit;
  box-shadow: 1px 2px 0px 2px #00000040;
  border-radius: 8px;
}
form ~ * {
  align-self: center;
}
h2 + p {
  text-align: center;
}
</style>
