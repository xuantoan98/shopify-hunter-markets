import { delegate, getAttribute, getModuleOptions, preventDefault, select } from 'lib/dom'
import { addQueryVar, getQueryVar, pipe } from 'lib/utils'
import { events } from 'lib/shopify'

const DEFAULTS = {
  currentTemplateSelector: '.js-pagination-current',
  linkTemplateSelector: '.js-pagination-link',
  dividerTemplateSelector: '.js-pagination-divider',
  nextTemplateSelector: '.js-pagination-next',
  previousTemplateSelector: '.js-pagination-previous',
  paginationListSelector: '.js-pagination-list',
  eventNamespace: 'pagination'
}

const getHref = getAttribute('href')

class Pagination {
  constructor (el) {
    this.el = el

    this.options = getModuleOptions(Pagination.moduleName, el, DEFAULTS)

    this.initProps()
    this.initEvents()
  }

  initProps () {
    this.getTemplates()
    this.paginationListEl = select(this.options.paginationListSelector)
  }

  initEvents () {
    delegate('click', pipe(
      preventDefault, this.changePage.bind(this)
    ), 'a', this.paginationListEl)
  }

  getTemplates () {
    const keys = [
      'current',
      'link',
      'divider',
      'next',
      'previous'
    ]

    this.templates = keys.reduce(
      (acc, key) => {
        const el = select(this.options[`${key}TemplateSelector`])

        if (el) {
          acc[key] = el.innerHTML
        }

        return acc
      },
      {}
    )
  }

  renderTemplate (key, args = []) {
    return args.reduce(
      (str, arg, idx) => str.replace(`%${idx + 1}%`, arg),
      this.templates[key]
    )
  }

  renderPageLink (page, template = 'link') {
    const args = [
      addQueryVar('page', page, window.location.href),
      page
    ]

    return this.renderTemplate(template, args)
  }

  render (currentPage, totalPages) {
    if (!this.paginationListEl) {
      return
    }

    const pages = []
    pages.push(this.renderTemplate('current', [currentPage]))

    for (let i = currentPage - 1; i > Math.max(currentPage - 3, 0); i--) {
      pages.unshift(this.renderPageLink(i))
    }

    if (currentPage > 4) {
      pages.unshift(this.renderTemplate('divider'))
    }

    if (currentPage > 3) {
      pages.unshift(this.renderPageLink(1))
    }

    if (currentPage > 1) {
      pages.unshift(this.renderPageLink(currentPage - 1, 'previous'))
    }

    for (let i = currentPage + 1; i <= Math.min(currentPage + 3, totalPages); i++) {
      pages.push(this.renderPageLink(i))
    }

    if (currentPage < totalPages - 3) {
      pages.push(this.renderTemplate('divider'))
    }

    if (currentPage < totalPages) {
      pages.push(this.renderPageLink(currentPage + 1, 'next'))
    }

    this.paginationListEl.innerHTML = pages.join('')
  }

  changePage (e) {
    const url = getHref(e.target)
    events.emit(`${this.options.eventNamespace}.paginate`, parseInt(getQueryVar('page', url)))
  }
}

Pagination.moduleName = 'pagination'

export default Pagination
