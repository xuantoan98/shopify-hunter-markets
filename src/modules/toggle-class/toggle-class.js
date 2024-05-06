import { addClass, getModuleOptions, getAttribute, setAttribute, on, removeClass, select, selectAll, setStyle } from 'lib/dom'

const MODULE_NAME = 'toggle-class'
const ATTR = 'aria-pressed'
const FILTER_COLLECTION_MODULE_NAME = '[data-module-init="collection-filter"]'
const DELAY_TIME = 50
const ITEMS_SELECTOR = '.js-count'
const isPressed = el => getAttribute(ATTR, el) === 'true'
const setPressed = setAttribute(ATTR)
const setDelay = setStyle('animationDelay')

export default (el) => {
  const defaults = {
    target: 'body',
    class: 'is-toggled',
    animation: false
  }
  const opt = getModuleOptions(MODULE_NAME, el, defaults)
  const target = select(opt.target)

  on('click', (e) => {
    const isOn = isPressed(el)
    e.preventDefault()
    if (isOn) {
      removeClass(opt.class, target)
    } else {
      addClass(opt.class, target)
    }
    if (opt.animation) {
      const filterEl = select(FILTER_COLLECTION_MODULE_NAME)
      const itemsSelector = selectAll(ITEMS_SELECTOR, filterEl)
      if (itemsSelector.length) {
        itemsSelector.forEach((item, index) => {
          setDelay(DELAY_TIME * index + 230 + 'ms', item)
        })
      }
    }
    setPressed(!isOn, el)
  }, el)

  on('class-removed.' + opt.class, () => {
    setPressed(false, el)
  }, target)
}
