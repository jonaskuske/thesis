<script lang="ts" setup>
import { ref } from 'vue'
import { navigate } from 'vike/client/router'
import { usePageContext } from '../../../../composables/usePageContext.ts'
import * as cookies from '../../../../utils/cookies.ts'

const ctx = usePageContext()

const notif = ref(false)

const isLoading = ref(false)

async function deleteLocation() {
  isLoading.value = true

  const locationIds = new Set((await cookies.get('location_ids')) ?? [])
  locationIds.delete(ctx.routeParams.value.locationId)
  await cookies.set('location_ids', [...locationIds])

  isLoading.value = false

  void navigate('/')
}
</script>

<template>
  <div class="notifications">
    <h2>Notifications</h2>
    <input id="notification-toggle" v-model="notif" notif type="checkbox" name="notifications" />
    <label for="notification-toggle">Notify me about upcoming sightings</label>
  </div>
  <div class="remove">
    <h2>Remove location from list</h2>
    <form action="delete" method="post" @submit.prevent="deleteLocation">
      <button type="submit" :disabled="isLoading">Remove location</button>
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
button:active {
  background: #5d00b9;
}
button:disabled {
  background: hsl(240, 8%, 53%);
  color: #ffffffaa;
}
</style>
