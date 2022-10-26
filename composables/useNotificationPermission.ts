import { onMounted, triggerRef } from 'vue'

export function useNotificationPermission() {
  let state = $ref(null as PermissionState | null)

  const updateState = (permission: NotificationPermission) => {
    state = permission === 'default' ? 'prompt' : permission
    triggerRef($$(state))
  }

  onMounted(() => updateState(Notification.permission))

  const request = (): Promise<boolean> => {
    return new Promise((resolve) => {
      void Notification.requestPermission(
        (permission) => (updateState(permission), resolve(permission === 'granted')),
      )
    })
  }

  return { state: $$(state), request }
}
