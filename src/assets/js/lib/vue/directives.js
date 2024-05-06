import { on, off } from 'lib/dom'

const getClickOutsideInstance = () => {
  let handler

  return {
    bind: function (el, binding, vnode) {
      handler = function (event) {
        if (el !== event.target && !el.contains(event.target)) {
          vnode.context[binding.expression](event)
        }
      }
      on('click', handler, document)
    },
    unbind: function () {
      off('click', handler, document)
    }
  }
}

export {
  getClickOutsideInstance
}
