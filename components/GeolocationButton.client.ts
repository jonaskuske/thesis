export type GeolocationData = { address: { postcode: string } }

const permission: EventTarget & { state: PermissionState } = Object.assign(new EventTarget(), {
  state: 'prompt' as PermissionState,
})

void navigator.permissions.query({ name: 'geolocation' }).then((status) => {
  permission.state = status.state
  status.addEventListener('change', () => {
    const evt = new CustomEvent('change', { detail: (permission.state = status.state) })
    permission.dispatchEvent(evt)
  })
})

export class GeolocationButton extends HTMLElement {
  button: HTMLButtonElement | undefined
  deniedMessage: HTMLParagraphElement | undefined
  buttonText = ''
  isLoading = false

  connectedCallback() {
    this.button = this.querySelector('button')!
    this.buttonText = this.button.textContent ?? ''
    this.deniedMessage = this.querySelector<HTMLParagraphElement>('.blocked-msg')!

    this.button.addEventListener('click', (evt) => this.handleClick(evt))
    permission.addEventListener('change', () => this.updateDeniedState())
    this.updateDeniedState()
  }

  updateDeniedState() {
    this.deniedMessage!.style.display = permission.state === 'denied' ? '' : 'none'

    if (permission.state === 'denied') {
      this.button!.setAttribute('aria-disabled', String((this.button!.disabled = true)))
    } else if (this.getAttribute('data-loading') !== 'true') {
      this.button!.setAttribute('aria-disabled', String((this.button!.disabled = false)))
    }
  }

  setLoadingState(state: boolean) {
    this.setAttribute('data-loading', String(state))
    this.button!.setAttribute('aria-disabled', String((this.button!.disabled = state)))
    this.button!.textContent = state ? 'Standort wird abgerufen...' : this.buttonText
  }

  handleClick(evt: Event) {
    if (this.button!.disabled) return

    evt.preventDefault()
    this.setLoadingState(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lon } }) => {
        void fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
          .then((response) => response.json())
          .then((result: GeolocationData) => {
            this.dispatchEvent(new CustomEvent('geolocation', { bubbles: true, detail: result }))
          })
          .finally(() => this.setLoadingState(false))
      },
      () => this.setLoadingState(false),
    )
  }
}
