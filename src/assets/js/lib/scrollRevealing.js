/* global IntersectionObserver */
require('intersection-observer')
// A very simple, unpolished way to do staggered reveals using
// IntersectionalObserver and no other dependencies
// Trigger reveal at this screen position. e.g. 0.5 means at the
// center of the screen
const THRESHOLD = 0.4
// The boundaries of elements matching this will be used for
// triggering the reveal
const SELECTOR_CONTAINER = '[data-reveal]'
// The selector to query all elements that are supposed to be revealed
const SELECTOR_ELEMENTS = '[data-reveal-order]'
// The delay between each individual element's animation
const DELAY = 400

const observer = new IntersectionObserver(
  (entries) => {
    // get the intersecting container elements
    const matchedElements = entries.filter(entry => entry.isIntersecting)
      .map(entry => entry.target)

    for (const el of matchedElements) {
      const children = el.querySelectorAll(SELECTOR_ELEMENTS)

      for (const childEl of children) {
        // staggered delay is determined by data-reveal-order
        const order = childEl.dataset.revealOrder || 1

        setTimeout(
          () => childEl.classList.add('is-revealed'),
          (order - 1) * DELAY
        )
      }
    }
  },
  { threshold: THRESHOLD }
)

export const scrollRevealing = (parent = document) => {
  const items = parent.querySelectorAll(SELECTOR_CONTAINER)
  for (const item of items) {
    observer.observe(item)
  }
}
