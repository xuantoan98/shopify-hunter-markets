/* global Promise */
import { getModuleOptions, ready } from 'lib/dom'
import { curry } from 'lib/utils'
import ee from 'event-emitter'
import nanoajax from 'nanoajax'
import * as createHistory from 'history'
import { formatMoney as shopifyFormatMoney } from '@shopify/theme-currency'
import { addItem } from '@shopify/theme-cart'

const MODULE_NAME = 'shop'
let settings = {}
ready(() => {
  settings = getModuleOptions(MODULE_NAME, document.body, {})
})

function Events () {
}
ee(Events.prototype)
const events = new Events()

const nanoPromise = (params, type = 'json') => new Promise((resolve, reject) => {
  if (type === 'document') {
    params.responseType = 'document'
  }
  nanoajax.ajax(
    params,
    (code, response) => {
      if (code === 200 && response) {
        if (type === 'json') {
          try {
            response = JSON.parse(response)
          } catch (e) {
          }
        }
        resolve(response)
      } else {
        reject(response)
      }
    }
  )
})

const fetchData = (endpoint, type = 'json') => {
  const params = {
    url: endpoint,
    method: 'GET'
  }
  return nanoPromise(params, type)
}

const postData = (endpoint, body, type = 'json') => {
  const params = {
    url: endpoint,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  return nanoPromise(params, type)
}

const getCart = () => fetchData('/cart?view=ajax').then((cart) => {
  events.emit('shopify.cart.get', cart)
  return cart
})

const getProduct = (productHandle) => fetchData('/products/' + productHandle + '.js')

const getShipping = (address) => {
  const url = `/cart/shipping_rates.json?shipping_address[zip]=${address.zip}&shipping_address[country]=${address.country}&shipping_address[province]=${address.province}`
  return fetchData(url, 'json').then((result) => {
    return result
  }, (error) => {
    try {
      return {
        error: JSON.parse(error)
      }
    } catch (e) {
    }
  })
}

const addToCart = curry(async (quantity, properties, id) => {
  const lineItem = await addItem(id, { quantity, properties })

  events.emit('shopify.cart.add', lineItem)
  return lineItem
})

const addMultiProductsToCart = (values) => {
  const items = {
    updates: values
  }

  return postData('/cart/update.js', items).then((lineItem) => {
    events.emit('shopify.cart.add', lineItem)
    return lineItem
  })
}

const clearCart = () => postData('/cart/clear.js').then((cart) => {
  events.emit('shopify.cart.clear', cart)
  return cart
})

const changeQuantity = curry((qty, id) => {
  // change.js endpoint doesn't play well with JSON int params
  // so we need to cast them to String here
  const item = {
    quantity: String(qty),
    id: String(id)
  }

  return postData('/cart/change.js', item).then((lineItem) => {
    events.emit('shopify.cart.change', lineItem)
    return lineItem
  })
})

const changeQuantities = (quantities) => postData('/cart/update.js', { updates: quantities })

const removeFromCart = changeQuantity(0)

const formatMoney = function (cents, format = settings.moneyFormat) {
  return shopifyFormatMoney(cents, format)
}

const history = createHistory.createBrowserHistory()

const getCartItemUniqueKey = (variantId, properties) => {
  const propertiesKey = properties
    ? Object.keys(properties).map(key => `${key}-${properties[key]}`).join(',')
    : ''
  return `${variantId}-${propertiesKey}`
}

export {
  addToCart,
  addMultiProductsToCart,
  clearCart,
  fetchData,
  getCart,
  getCartItemUniqueKey,
  getProduct,
  getShipping,
  changeQuantity,
  changeQuantities,
  formatMoney,
  nanoPromise,
  postData,
  removeFromCart,
  events,
  history
}
