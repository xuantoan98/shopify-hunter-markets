import {
  select,
  selectAll,
  on,
  addClass,
  removeClass,
  preventDefault,
  createElement,
  append,
  hasClass,
  getParent,
  setStyle
} from 'lib/dom'
import { map, pipe } from 'lib/utils'

const ACTIVE_CLASS = 'is-pointer-down'
const DRAGGING_CLASS = 'dragging'
const SCROLLBAR_INIT_CLASS = 'drag-scroll--init'
const SCROLLBAR_CLASS = 'drag-scroll__bar'
const SCROLLBAR_THUMB_CLASS = 'drag-scroll__bar-thumb'

export const dragScroll = () => {
  const sliders = selectAll('[data-drag-scroll]')
  const init = () => {
    map(slider => {
      let isDown = false
      let startX = 0
      let scrollLeft = 0
      const deactivateDragging = () => {
        isDown = false
        removeClass(ACTIVE_CLASS, slider)
        removeClass(DRAGGING_CLASS, slider)
      }
      const createDragScrollbar = () => {
        if (hasClass(SCROLLBAR_INIT_CLASS, slider)) {
          calculateScrollbar()
          return
        }
        const scrollbarEl = pipe(
          createElement,
          addClass(SCROLLBAR_CLASS)
        )('div')
        const scrollbarThumbEl = pipe(
          createElement,
          addClass(SCROLLBAR_THUMB_CLASS)
        )('div')
        const parentEl = getParent(slider)
        append(scrollbarEl, scrollbarThumbEl)
        append(parentEl, scrollbarEl)
        addClass(SCROLLBAR_INIT_CLASS, slider)
        calculateScrollbar()
      }
      const calculateScrollbar = () => {
        const scrollbarThumbEl = select(`.${SCROLLBAR_THUMB_CLASS}`, getParent(slider))
        const percentage = slider.clientWidth / slider.scrollWidth * 100
        if (scrollbarThumbEl) {
          setStyle('width', `${percentage}%`, scrollbarThumbEl)
        }
      }
      createDragScrollbar()
      on('mousedown', (e) => {
        isDown = true
        addClass(ACTIVE_CLASS, slider)
        startX = e.pageX - slider.offsetLeft
        scrollLeft = slider.scrollLeft
      }, slider)
      on('mouseleave', () => {
        deactivateDragging()
      }, slider)
      on('mouseup', (e) => {
        deactivateDragging()
      }, slider)
      on('mousemove', (e) => {
        if (!isDown) {
          return
        }
        preventDefault(e)
        addClass(DRAGGING_CLASS, slider)
        const x = e.pageX - slider.offsetLeft
        const walk = x - startX
        slider.scrollLeft = scrollLeft - walk
      }, slider)
      on('scroll', (e) => {
        const scrollbarThumbEl = select(`.${SCROLLBAR_THUMB_CLASS}`, getParent(slider))
        if (scrollbarThumbEl) {
          const movePercentage = slider.scrollLeft / slider.scrollWidth * 100
          setStyle('left', `${movePercentage}%`, scrollbarThumbEl)
        }
      }, slider)
    }, sliders)
  }
  init()
  on('resize', init, window)
}
