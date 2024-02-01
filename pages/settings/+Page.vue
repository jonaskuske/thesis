<script lang="ts" setup>
import * as store from '../../utils/cookies'

type Data = {
  userId: string | null
  geolocationEnabled: boolean
  notificationsEnabled: boolean
}
import { watch, watchEffect, ref } from 'vue'
import AtSign from '../../components/icons/AtSign.vue'
import Avatar from '../../components/icons/Avatar.vue'
import Key from '../../components/icons/Key.vue'
import { useNotificationPermission } from '../../composables/useNotificationPermission'
import { useLocationPermission } from '../../composables/useGeolocationPermission'
import { usePageData } from '../../composables/usePageData'

const data = usePageData<Data>()
const userId = ref(data.value.userId)
const geolocationEnabled = ref(data.value.geolocationEnabled)
const notificationsEnabled = ref(data.value.notificationsEnabled)

const geolocationPermission = useLocationPermission()
const geolocationPermissionState = geolocationPermission.state

watch(geolocationEnabled, (enabled) => {
  void store.set('geolocation_enabled', enabled)

  if (enabled && geolocationPermissionState.value === 'prompt') {
    void geolocationPermission.request()
  }
})

watchEffect(() => {
  if (geolocationPermissionState && geolocationPermissionState.value !== 'granted') {
    geolocationEnabled.value = false
  }
})

const notificationPermission = useNotificationPermission()
const notificationPermissionState = notificationPermission.state

watch(notificationsEnabled, (enabled) => {
  void store.set('notifications_enabled', enabled)

  if (enabled && notificationPermissionState.value === 'prompt') {
    void notificationPermission.request()
  }
})

watchEffect(() => {
  if (notificationPermissionState && notificationPermissionState.value !== 'granted') {
    notificationsEnabled.value = false
  }
})

async function login() {
  const id = crypto.randomUUID()
  await store.set('user_id', id)
  userId.value = id
}

async function logout() {
  await store.remove('user_id')
  userId.value = null
}
</script>

<template>
  <TransitionGroup>
    <h2 key="a">Account</h2>
    <div v-if="userId" key="b" class="card">
      <p><AtSign /> bertha.beispiel@gmail.com</p>
      <h2><Avatar /> Bertha Beispiel</h2>
      <h2><Key /> **************</h2>
      <div>
        <form action="/logout" method="post" @submit.prevent="logout">
          <button type="submit">Abmelden</button>
        </form>
        <form action="/change_pw" method="get">
          <button disabled type="submit">Passwort ändern</button>
        </form>
      </div>
    </div>
    <div v-else key="c" class="not-logged-in">
      <p>Du bist nicht angemeldet.</p>
      <form action="/login" @submit.prevent="login">
        <button type="submit">Anmelden</button>
      </form>
      <form action="/signup" @submit.prevent="login">
        <button type="submit">Registrieren</button>
      </form>
    </div>

    <div key="d" class="location">
      <h2>Standort</h2>
      <input
        id="location"
        v-model="geolocationEnabled"
        type="checkbox"
        name="location"
        :disabled="geolocationPermissionState === 'denied'"
      />
      <label for="location"> GPS-Standortdaten verwenden</label>
      <p v-if="geolocationPermissionState === 'denied'" style="font-size: 12px">
        Standortzugriff in den Systemeinstellungen blockiert.
      </p>
    </div>
    <div key="e" class="notifications">
      <h2>Mitteilungen</h2>
      <input
        id="notifications"
        v-model="notificationsEnabled"
        type="checkbox"
        name="notifications"
        :disabled="notificationPermissionState === 'denied'"
      />
      <label for="notifications"> Bei anstehenden Sichtungen benachrichtigen</label>
      <p v-if="notificationPermissionState === 'denied'" style="font-size: 12px">
        Benachrichtigungen in den Systemeinstellungen blockiert.
      </p>
    </div>
  </TransitionGroup>
</template>

<style scoped>
.v-move {
  transition: transform 500ms;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-enter-active {
  transition: opacity 200ms 300ms ease-in;
}
.v-leave-active {
  position: absolute;
  visibility: hidden;
  transition: transform 1ms;
}

.location {
  margin: 24px 0;
}

form {
  display: inline-block;
}

.not-logged-in button[type='submit'] {
  padding: 8px 16px;
  background: #4d009c;
  color: inherit;
  box-shadow: 1px 2px 0px 2px #00000040;
  border-radius: 8px;
  align-self: center;
  user-select: none;
}
.not-logged-in button[type='submit']:disabled {
  background-color: hsl(240, 8%, 53%);
  color: #ffffffaa;
}
.not-logged-in button[type='submit']:active {
  background: #5d00b9;
}
.not-logged-in form[action='/login'] button[type='submit'] {
  margin-right: 16px;
}

.card {
  background: rgba(108, 91, 216, 0.2);
  box-shadow: 0px 0px 6px 2px rgba(164, 164, 164, 0.25);
  border-radius: 8px;
  padding: 24px;
}
.card button {
  color: #d9d2ff;
  margin-right: 12px;
}
.card button:disabled {
  color: hsl(240, 8%, 53%);
}
a {
  display: inline-block;
  vertical-align: bottom;
}
a svg {
  display: inline-block;
}
h1 {
  display: inline-block;
  margin-block: 0;
}
label {
  margin-block-start: 16px;
}
</style>
