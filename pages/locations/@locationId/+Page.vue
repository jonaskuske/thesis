<script setup lang="ts">
import NoFlyOverGraphic from '../../../components/NoFlyOverGraphic.vue'
</script>

<template>
  <div class="list">
    <NoFlyOverGraphic class="img" />
    <h2>Keine Sichtungen prognostiziert</h2>
    <p>
      Leider sind für diesen Standort keine Sichtungen prognostiziert. Du kannst später noch mal
      vorbei schauen oder einen anderen Ort auswählen.
    </p>
  </div>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}
.img {
  margin-bottom: 16px;
}
h2,
h2 + p {
  text-align: center;
}
</style>
