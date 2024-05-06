<template>
  <form
    :class="className"
    action="/cart"
    method="post"
    novalidate
    data-cart-id="cart-layout"
  >
    <div v-if="cartCount > 0">
      <div :class="classContainer">
        <div class="cart-layout__header">
          <button
            v-if="!saveCartImmediately"
            class="link"
            type="button"
            @click="update"
          >
            {{ cartUpdateText }}
          </button>
          <a
            href="/"
            class="link"
          >
            {{ continueShoppingText }}
          </a>
        </div>
        <div class="grid grid--no-gutter">
          <slot
            name="main"
            v-bind="{ cart, cartPreview, getCartItemKey, saveCartImmediately, updateItem }"
          >
            <div class="grid__item cart-layout__block cart-layout__block--main">
              <div class="cart-layout__block-main">
                <cart-row
                  v-for="(item, index) in cart.items"
                  :key="getCartItemKey(item)"
                  :value="cart.items[index]"
                  :line-index="index"
                  :is-auto-update-cart="saveCartImmediately"
                  @input="updateItem"
                />
              </div>
            </div>
          </slot>

          <slot
            name="sidebar"
            v-bind="{ cartCount, cartTotal, saveCartImmediately, cartUpdateText, continueShoppingText }"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <slot name="empty">
        <div class="cart-layout__empty">
          <div class="container">
            <div class="wysiwyg wysiwyg--cart">
              <h2>{{ emptyText }}</h2>
              <!-- eslint-disable -->
              <p v-html="descriptionEmptyText"></p>
              <!-- eslint-enable -->
            </div>
          </div>
        </div>
      </slot>
    </div>
  </form>
</template>
<script>
import { formatMoney, getCartItemUniqueKey } from 'lib/shopify'
import cloneDeep from 'lodash.clonedeep'

export default {
  props: {
    saveCartImmediately: Boolean,
    className: {
      type: String,
      default: 'cart-layout'
    },
    classContainer: {
      type: String,
      default: 'container'
    },
    emptyText: {
      type: String,
      default: ''
    },
    descriptionEmptyText: {
      type: String,
      default: ''
    },
    continueShoppingText: {
      type: String,
      default: 'Continue Shopping'
    },
    cartUpdateText: {
      type: String,
      default: 'Update Cart'
    }
  },
  data () {
    return {
      hover: false,
      tempCart: null
    }
  },
  computed: {
    cartCount () {
      return this.cart['item_count']
    },
    cartTotal () {
      return formatMoney(this.cart.items.reduce((sum, item) => sum + item.line_price, 0))
    },
    cart () {
      return this.$store.getters['cartLayout/cart']
    },
    cartPreview () {
      return this.$store.getters['cartLayout/cartPreview']
    }
  },
  watch: {
    cart: {
      deep: true,
      immediate: true,
      handler (newValue) {
        this.tempCart = cloneDeep(newValue)
      }
    }
  },
  methods: {
    getCartItemKey (item) {
      return getCartItemUniqueKey(item['variant_id'], item.properties)
    },
    updateItem (newItem, index) {
      this.tempCart.items[index] = newItem
      if (this.saveCartImmediately) {
        this.$store.dispatch('cartLayout/updateCart', this.tempCart)
      }
    },
    update () {
      this.$store.dispatch('cartLayout/updateCart', this.tempCart)
    },
    formatMoney
  }
}
</script>
