<script lang="ts" setup>
import { ref } from 'vue'

const notif = ref(false)
</script>

<template>
  <div class="notifications">
    <h2>Benachrichtigungen</h2>
    <input id="notification-toggle" v-model="notif" notif type="checkbox" name="notifications" />
    <label for="notification-toggle">Benachrichtigungen aktivieren</label>
  </div>
  <div class="remove">
    <h2>Aus der Liste entfernen</h2>
    <form action="delete" method="post">
      <button type="submit">Ort entfernen</button>
    </form>
  </div>
</template>

<style scoped>
div {
  margin: auto;
}
label {
  margin-inline-start: 16px;
}
.notifications,
.remove {
  width: 100%;
  margin-top: 24px;
}
button {
  padding: 8px 16px;
  background: #4d009c;
  color: inherit;
  box-shadow: 1px 2px 0px 2px #00000040;
  border-radius: 8px;
  user-select: none;
}
</style>
