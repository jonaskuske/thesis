export class GeolocationPermission extends EventTarget {
  #state = 'prompt' as PermissionState

  constructor() {
    super()

    void navigator.permissions.query({ name: 'geolocation' }).then((status) => {
      const update = () => {
        this.#state = status.state
        this.dispatchEvent(new Event('change'))
      }
      update()
      status.addEventListener('change', update)
    })
  }

  get state() {
    return this.#state
  }

  request(): Promise<boolean> {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
      )
    })
  }
}
