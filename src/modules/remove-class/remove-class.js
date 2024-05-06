import { getModuleOptions, on, removeClass, select, trigger } from 'lib/dom'

const MODULE_NAME = 'remove-class'

export default (el) => {
  const defaults = {
    target: 'body'
  }

  const opt = getModuleOptions(MODULE_NAME, el, defaults)
  const target = select(opt.target)

  if (opt.class) {
    on('click', (e) => {
      e.preventDefault()
      removeClass(opt.class, target)
      trigger('class-removed.' + opt.class, target)
    }, el)
  }
}
