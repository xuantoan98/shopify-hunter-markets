import store from 'lib/store'
import { getProp, map, pipe, isNaiveEqual } from 'lib/utils'
import { changeQuantities, removeFromCart, addToCart, getCart } from 'lib/shopify'

const getQuantities = pipe(
  getProp('items'),
  map(getProp('quantity'))
)

const getProperties = pipe(
  getProp('items'),
  map(getProp('properties'))
)

export default () => {
  store.registerModule('cartLayout', {
    namespaced: true,
    state: {
      relatedProducts: [],
      cartPreview: null,
      cart: (window.SLS_STATE && window.SLS_STATE.cart) || {}
    },
    getters: {
      cart (state) {
        return state.cart
      },
      cartPreview (state) {
        return state.cartPreview
      }
    },
    mutations: {
      mutateRelatedProducts (state, product) {
        state.relatedProducts.push(product)
      },
      mutateCart (state, cart) {
        state.cart = { ...cart }
      },
      mutateCartPreview (state, product) {
        state.cartPreview = product
      }
    },
    actions: {
      addRelatedProducts ({ commit, state }, product) {
        const exist = state.relatedProducts.some(p => p.id === product.id)
        if (!exist) {
          commit('mutateRelatedProducts', product)
        }
      },
      async updateCart (context, cart) {
        const currentQuantities = getQuantities(cart)
        const stateQuantities = getQuantities(context.state.cart)

        const currentProperties = getProperties(cart)
        const stateProperties = getProperties(context.state.cart)

        for (let i = 0; i < currentProperties.length; i++) {
          const property = currentProperties[i] || {}
          const stateProperty = stateProperties[i] || {}

          const item = cart.items[i]
          if (!isNaiveEqual(property, stateProperty)) {
            const tempCart = await removeFromCart(item.id)
            if (tempCart) {
              currentQuantities.splice(i, 1)
              stateQuantities.splice(i, 1)
            }
            const newItem = await addToCart(item.quantity, item.properties, item.id)
            if (newItem) {
              currentQuantities.unshift(item.quantity)
              stateQuantities.unshift(item.quantity)
            }
          }
        }

        if (!isNaiveEqual(currentQuantities, stateQuantities)) {
          const response = await changeQuantities(currentQuantities)
          if (response) {
            const newCart = await getCart()
            context.commit('mutateCart', newCart)
          }
        }
      },
      async addToCart (context, cart) {
        context.commit('mutateCart', cart)
      },
      addToCartPreview ({ state, commit }, payload) {
        if (state !== payload) {
          commit('mutateCartPreview', payload)
        } else {
          console.log('exits')
        }
      },
      async removeFromCart (context, item) {
        try {
          await removeFromCart(item.id)
          const newCart = await getCart()
          context.commit('mutateCart', newCart)
        } catch (error) {
          console.error(error)
        }
      }
    }
  })
}
