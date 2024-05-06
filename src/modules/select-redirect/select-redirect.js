import { setStyle, getModuleOptions, on, select, setAttribute, ready } from 'lib/dom'

const MODULE = 'select-redirect'

export default (el) => {
  const URL = window.URL
  const defaults = {
    queryVar: 'sort_by'
  }
  const opt = getModuleOptions(MODULE, el, defaults)

  const setSelectWidth = (value) => {
    // Default value for options 'Sort by' width
    let optionWidth = '75px'
    const optionSelected = select('option[value="' + value + '"]', el)
    if (optionSelected) {
      optionWidth = 10 + (optionSelected.text.length * 8) + 'px'
    }
    setStyle('width', optionWidth, el)
  }

  const setSelectedSortBy = (value) => {
    const optionSelected = select('option[value="' + value + '"]', el)
    if (optionSelected) {
      setAttribute('selected', true, optionSelected)
    }
  }

  const getValueSortBy = () => {
    const url = new URL(window.location.href)
    const value = url.searchParams.get(opt.queryVar)
    if (value) {
      setSelectWidth(value)
      setSelectedSortBy(value)
    }
  }

  ready(getValueSortBy)

  on('change', function () {
    setSelectWidth(el.value)
    const url = new URL(window.location.href)
    url.searchParams.set(opt.queryVar, el.value)
    window.location.href = url
  }, el)
}
