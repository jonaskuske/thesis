import { ref, onMounted } from 'vue'

export function useLocationPermission() {
  const state = ref(null as PermissionState | null)

  const updateState = () => {
    void navigator.permissions.query({ name: 'geolocation' }).then((status) => {
      status.addEventListener('change', () => (state.value = status.state))
      state.value = status.state
    })
  }

  onMounted(updateState)

  const request = (): Promise<boolean> => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
      )
    })
  }

  return { state, request }
}
