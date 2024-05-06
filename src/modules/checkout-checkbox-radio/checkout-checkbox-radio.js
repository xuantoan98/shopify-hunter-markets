import { addClass, on, removeClass, selectAll, select, toggleClass, closest } from 'lib/dom'

const checkboxSelector = '.checkbox-wrapper'
const radioSelector = '.radio-wrapper'
const checkboxActiveClass = 'checkbox-wrapper--active'
const radioActiveClass = 'radio-wrapper--active'
const checkboxEl = selectAll(checkboxSelector)
const radioEl = selectAll(radioSelector)

export default el => {
  if (checkboxEl) {
    checkboxEl.map((item) => {
      const checkbox = select('input[type="checkbox"]', item)
      if (checkbox.checked) {
        addClass(checkboxActiveClass, item)
      }
      on('click', (e) => {
        toggleClass(checkboxActiveClass, item)
        checkbox.checked = !checkbox.checked
        e.preventDefault()
      }, item)
    })
  }

  if (radioEl) {
    radioEl.map((item) => {
      const radio = select('input[type="radio"]', item)
      if (radio) {
        const box = closest('.content-box', item)
        const siblingsRadioEls = selectAll('.radio-wrapper', box)
        if (radio.checked) {
          addClass(radioActiveClass, item)
        }
        on('click', () => {
          removeClass(radioActiveClass, siblingsRadioEls)
          addClass(radioActiveClass, item)
        }, item)
      }
    })
  }
}
