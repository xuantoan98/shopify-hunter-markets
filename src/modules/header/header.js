/* global requestAnimationFrame */
import Stickyfill from 'stickyfilljs'
import { addClass, onPassive, removeClass, select } from 'lib/dom'

const STICKY_HEADER = 'is-sticky'
const TOPBAR_SELECTOR = '.js-sticky-topbar'

export default (el) => {
  let ticking = false

  const topBarSection = select(TOPBAR_SELECTOR)
  if (topBarSection) {
    Stickyfill.add(topBarSection)
  }
  Stickyfill.add(el)

  const makeHeaderSticky = (currentPos) => {
    const shouldStick = currentPos > 0

    if (shouldStick) {
      addClass(STICKY_HEADER, el)
    } else {
      removeClass(STICKY_HEADER, el)
    }
  }

  const stickyHeader = () => {
    if (!ticking) {
      requestAnimationFrame(function () {
        makeHeaderSticky(window.scrollY || window.pageYOffset)
        ticking = false
      })

      ticking = true
    }
  }

  onPassive('scroll', stickyHeader, window)
}
