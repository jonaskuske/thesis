import { ref, onMounted, triggerRef } from 'vue'

export function useLocationPermission() {
  const state = ref(null as PermissionState | null)

  const updateState = () => {
    void navigator.permissions.query({ name: 'geolocation' }).then((status) => {
      state.value = status.state
      triggerRef(state)
    })
  }

  onMounted(updateState)

  const request = (): Promise<boolean> => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => (updateState(), resolve(true)),
        () => (updateState(), resolve(false)),
      )
    })
  }

  return { state, request }
}
