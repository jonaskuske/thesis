export type GeolocationData = { address: { postcode: string } }

import { GeolocationPermission } from '../utils/GeolocationPermission'

const geolocationPermission = new GeolocationPermission()

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
    geolocationPermission.addEventListener('change', () => this.updateDeniedState())
    this.updateDeniedState()
  }

  updateDeniedState() {
    this.deniedMessage!.style.display = geolocationPermission.state === 'denied' ? '' : 'none'

    if (geolocationPermission.state === 'denied') {
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
