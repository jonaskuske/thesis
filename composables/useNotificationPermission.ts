import { ref, onMounted, triggerRef } from 'vue'

export function useNotificationPermission() {
  const state = ref(null as PermissionState | null)

  const updateState = (permission: NotificationPermission) => {
    state.value = permission === 'default' ? 'prompt' : permission
    triggerRef(state)
  }

  onMounted(() => updateState(Notification.permission))

  const request = (): Promise<boolean> => {
    return new Promise((resolve) => {
      void Notification.requestPermission(
        (permission) => (updateState(permission), resolve(permission === 'granted')),
      )
    })
  }

  return { state, request }
}
