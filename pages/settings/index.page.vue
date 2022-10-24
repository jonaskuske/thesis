<script lang="ts">
export const headerTitle = 'Einstellungen'
export default {}
</script>

<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { useCookies } from '../../composables/useCookies'

const {
  userId: initialUserId,
  locationIsOn: initialLocationIsOn,
  notificationIsOn: initialNotificationIsOn,
} = defineProps<{
  userId?: string
  locationIsOn: boolean
  notificationIsOn: boolean
}>()

const { set, remove } = useCookies()

let locationIsOn = $ref(initialLocationIsOn)
let locationPermission: PermissionState = $ref('prompt')

const updateLocationPermission = () => {
  void navigator.permissions.query({ name: 'geolocation' }).then((status) => {
    locationPermission = status.state
    if (status.state !== 'granted') locationIsOn = false
  })
}

onMounted(() => void updateLocationPermission())

watch($$(locationIsOn), (on) => {
  void set('location_pref', on ? '1' : '0')

  if (on && locationPermission === 'prompt') {
    navigator.geolocation.getCurrentPosition(updateLocationPermission, updateLocationPermission)
  }
})

let notificationIsOn = $ref(initialNotificationIsOn)
let notificationsPermission: PermissionState = $ref('prompt')

const updateNotificationPermission = () => {
  void navigator.permissions.query({ name: 'notifications' }).then(({ state }) => {
    notificationsPermission = state
    if (state !== 'granted') notificationIsOn = false
  })
}
onMounted(() => void updateNotificationPermission())
watch($$(notificationIsOn), (on) => {
  void set('notification_pref', on ? '1' : '0')

  if (on && notificationsPermission === 'prompt') {
    void Notification.requestPermission(updateNotificationPermission)
  }
})

let userId: string | undefined = $ref(initialUserId)

async function login() {
  const id = crypto.randomUUID()
  await set('user_id', id)
  userId = id
}

async function logout() {
  await remove('user_id')
  userId = undefined
}
</script>

<template>
  <TransitionGroup>
    <h2 key="a">Account</h2>
    <div v-if="userId" key="b" class="card">
      <p>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_112_331)">
            <path
              d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11H8.5V10H6C3.83 10 2 8.17 2 6C2 3.83 3.83 2 6 2C8.17 2 10 3.83 10 6V6.715C10 7.11 9.645 7.5 9.25 7.5C8.855 7.5 8.5 7.11 8.5 6.715V6C8.5 4.62 7.38 3.5 6 3.5C4.62 3.5 3.5 4.62 3.5 6C3.5 7.38 4.62 8.5 6 8.5C6.69 8.5 7.32 8.22 7.77 7.765C8.095 8.21 8.655 8.5 9.25 8.5C10.235 8.5 11 7.7 11 6.715V6C11 3.24 8.76 1 6 1ZM6 7.5C5.17 7.5 4.5 6.83 4.5 6C4.5 5.17 5.17 4.5 6 4.5C6.83 4.5 7.5 5.17 7.5 6C7.5 6.83 6.83 7.5 6 7.5Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_112_331">
              <rect width="12" height="12" fill="white" />
            </clipPath>
          </defs>
        </svg>
        bertha.beispiel@gmail.com
      </p>
      <h2>
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style="transform: translateY(3px)"
        >
          <g clip-path="url(#clip0_110_314)">
            <path
              d="M12 12.5C14.21 12.5 16 10.71 16 8.5C16 6.29 14.21 4.5 12 4.5C9.79 4.5 8 6.29 8 8.5C8 10.71 9.79 12.5 12 12.5ZM12 14.5C9.33 14.5 4 15.84 4 18.5V20.5H20V18.5C20 15.84 14.67 14.5 12 14.5Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_110_314">
              <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
            </clipPath>
          </defs>
        </svg>
        Bertha Beispiel
      </h2>
      <h2>
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_110_317)">
            <path
              d="M12.65 10.5C11.83 8.17 9.61 6.5 7 6.5C3.69 6.5 1 9.19 1 12.5C1 15.81 3.69 18.5 7 18.5C9.61 18.5 11.83 16.83 12.65 14.5H17V18.5H21V14.5H23V10.5H12.65ZM7 14.5C5.9 14.5 5 13.6 5 12.5C5 11.4 5.9 10.5 7 10.5C8.1 10.5 9 11.4 9 12.5C9 13.6 8.1 14.5 7 14.5Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_110_317">
              <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
            </clipPath>
          </defs>
        </svg>
        **************
      </h2>
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
        v-model="locationIsOn"
        type="checkbox"
        name="location"
        :disabled="locationPermission === 'denied'"
      />
      <label for="location"> GPS-Standortdaten verwenden</label>
      <p v-if="locationPermission === 'denied'" style="font-size: 12px">
        Standortzugriff in den Systemeinstellungen blockiert.
      </p>
    </div>
    <div key="e" class="notifications">
      <h2>Mitteilungen</h2>
      <input
        id="notifications"
        v-model="notificationIsOn"
        type="checkbox"
        name="notifications"
        :disabled="notificationsPermission === 'denied'"
      />
      <label for="notifications"> Mitteilungen erlauben</label>
      <p v-if="notificationsPermission === 'denied'" style="font-size: 12px">
        Mitteilungen in den Systemeinstellungen blockiert.
      </p>
      <div style="margin-top: 12px">
        <input
          id="notifications-enabled"
          type="checkbox"
          name="notifications-enabled"
          :disabled="true"
        />
        <label for="notifications-enabled"> Erinnerung an Sichtung</label>
      </div>
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
