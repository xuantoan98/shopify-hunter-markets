<template>
  <transition name="fade">
    <div
      v-if="isNotificationDisplayed"
      class="cart-notification"
      :class="{ 'cart-notification--active': isNotificationDisplayed }"
    >
      <div :class="['cart-notification__inner', { 'cart-notification__inner--has-items': cartPreview }]">
        <slot
          name="header"
          v-bind="{ cart, cartPreview, hideCartDropdown }"
        />
        <slot name="main" />
      </div>
      <transition name="fade">
        <div
          v-if="isAdding"
          class="cart-notification__loading"
        >
          <spin-loading class-name="spin-loading--cart-notification" />
        </div>
      </transition>
      <transition name="fade">
        <div
          v-if="isNotificationDisplayed"
          class="cart-notification__overlay"
          @click="hideCartDropdown"
        />
      </transition>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { getCart } from 'lib/shopify'

export default {
  data () {
    return {
      isAdding: false
    }
  },
  computed: {
    isNotificationDisplayed () {
      return this.isDropdownDisplayed
    },
    cart () {
      return this.$store.getters['cartLayout/cart']
    },
    cartPreview () {
      return this.$store.getters['cartLayout/cartPreview']
    },
    ...mapState('cartTrigger', ['isDropdownDisplayed'])
  },
  methods: {
    async updateNewCart () {
      const newCart = await getCart()
      this.$store.dispatch('cartLayout/addToCart', newCart)
    },
    ...mapActions('cartTrigger', ['hideCartDropdown'])
  }
}
</script>
