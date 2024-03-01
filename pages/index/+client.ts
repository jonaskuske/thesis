import '../../renderer/+client'
import { GeolocationButton, type GeolocationData } from '../../components/GeolocationButton.client'
import type CitiesJson from 'zip-to-city/germany.json'
type Cities = typeof CitiesJson

window.customElements.define('geolocation-button', GeolocationButton)

const show = (...els: HTMLElement[]) => els.forEach((el) => (el.style.display = ''))
const hide = (...els: HTMLElement[]) => els.forEach((el) => (el.style.display = 'none'))

const searchInput = document.querySelector<HTMLInputElement>(
  'input[name="location"][type="search"]',
)!

document.body.addEventListener('geolocation', ((evt: CustomEvent<GeolocationData>) => {
  searchInput.value = evt.detail.address.postcode
  searchInput.dispatchEvent(new Event('input', { bubbles: true }))
}) as EventListener)

const searchFormLocationBtn = document.querySelector<HTMLButtonElement>(
  '.search-form .button-location',
)!
const locationList = document.querySelector<HTMLDivElement>('.list')!
const results = document.querySelector<HTMLDivElement>('.results')!
const resultTemplate = document.querySelector<HTMLTemplateElement>('#result-template')!
const noResults = document.querySelector<HTMLParagraphElement>('.no-results')!

let abortHandler = new AbortController()

searchInput.addEventListener('input', () => {
  abortHandler.abort()
  abortHandler = new AbortController()

  if (!searchInput.value) {
    show(locationList)
    hide(results, noResults, searchFormLocationBtn)

    return
  }

  hide(locationList)
  show(searchFormLocationBtn)

  void fetch(`/cities?search=${searchInput.value}&limit=20`, { signal: abortHandler.signal })
    .then((response) => response.json())
    .then((cities: Cities) => {
      if (!cities.length) {
        noResults.textContent = noResults.textContent!.replace(/".*"/, `"${searchInput.value}"`)!
        show(noResults)
        hide(results)
      } else {
        hide(noResults)
        results.replaceChildren(
          ...cities.map((city) => {
            const result = resultTemplate.content.cloneNode(true) as DocumentFragment
            const name = result.querySelector<HTMLParagraphElement>('.result-name')!
            name.textContent = name.textContent!.replace(
              /_(zip|city)_/g,
              (_, key: keyof typeof city) => city[key],
            )
            result.querySelector<HTMLInputElement>('input[name="id"]')!.value = city.id
            return result
          }),
        )
        show(results)
      }
    })
})
