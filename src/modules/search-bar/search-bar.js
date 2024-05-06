import { addClass, on, select, removeClass } from 'lib/dom'
import { clearAllBodyScrollLocks } from 'lib/bodyScrollLock'

const body = document.body
const SEARCH_FORM_ACTIVE_CLASS = 'is-search-keyup-active'
const SEARCH_ACTIVE_CLASS = 'is-search-active'
const SEARCH_TRIGGER_SELECTOR = '.js-search-trigger'
const SEARCH_MODAL_BUTTON_CLOSE = '.js-modal-button'
const SEARCH_MODAL_OVERLAY = '.js-modal-overlay'

export default (el) => {
  const inputSearchEl = select('.js-search-input', el)
  const inputSearchHiddenEl = select('.js-search-input-hidden', el)
  const searchTriggerEl = select(SEARCH_TRIGGER_SELECTOR, body)
  const searchModalButtonEl = select(SEARCH_MODAL_BUTTON_CLOSE, body)
  const searchModalOverlayEl = select(SEARCH_MODAL_OVERLAY, body)
  const processSearchTerm = (value) => {
    return value.replace(/^\s+|\s+$/g, '')
  }
  if (inputSearchEl) {
    on('keyup', () => {
      if (inputSearchEl.value !== '') {
        addClass(SEARCH_FORM_ACTIVE_CLASS, body)
      } else {
        removeClass(SEARCH_FORM_ACTIVE_CLASS, body)
      }
      inputSearchHiddenEl.value = processSearchTerm(inputSearchEl.value)
    }, inputSearchEl)
    const removeSearchActive = () => {
      removeClass(SEARCH_FORM_ACTIVE_CLASS, body)
      removeClass(SEARCH_ACTIVE_CLASS, body)
      clearAllBodyScrollLocks()
    }
    if (searchTriggerEl) {
      on('click', () => {
        inputSearchEl.focus()
      }, searchTriggerEl)
    }
    if (searchModalButtonEl) {
      on('click', () => {
        inputSearchEl.value = ''
        removeSearchActive()
      }, searchModalButtonEl)
    }
    if (searchModalOverlayEl) {
      on('click', () => {
        inputSearchEl.value = ''
        removeSearchActive()
      }, searchModalOverlayEl)
    }
  }
}
