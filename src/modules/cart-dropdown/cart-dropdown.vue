<template>
  <transition name="fade-down">
    <div
      v-if="isDropdownDisplayed"
      class="cart-dropdown"
      :class="{ 'cart-dropdown--active': isDropdownDisplayed }"
      @mouseover="clearDropdownTimeout"
      @mouseleave="hideCartDropdown"
    >
      <div :class="['cart-dropdown__inner', { 'cart-dropdown__inner--has-items': cart.item_count > 0 }]">
        <slot
          name="header"
          v-bind="{ cart, cartCountInfo, hideCartDropdown }"
        />
        <slot name="main" />
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: {},
  data () {
    return {}
  },
  computed: {
    cartCount () {
      return this.cart['item_count']
    },
    cartCountInfo () {
      const count = this.cartCount
      return count === 1 ? count + ' Item' : count + ' Items'
    },
    cart () {
      return this.$store.getters['cartLayout/cart']
    },
    ...mapState('cartTrigger', ['isDropdownDisplayed'])
  },
  methods: {
    ...mapActions('cartTrigger', ['clearDropdownTimeout', 'hideCartDropdown'])
  }
}
</script>
