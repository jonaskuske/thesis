import { ref, onMounted } from 'vue'
import { GeolocationPermission } from '../utils/GeolocationPermission.ts'

let geolocationPermission: GeolocationPermission

export function useLocationPermission() {
  const state = ref(null as PermissionState | null)

  onMounted(() => {
    if (!geolocationPermission) geolocationPermission = new GeolocationPermission()
    const callback = () => (state.value = geolocationPermission.state)
    geolocationPermission.addEventListener('change', callback)
    return () => geolocationPermission.removeEventListener('change', callback)
  })

  return { state, request: () => geolocationPermission.request() }
}
