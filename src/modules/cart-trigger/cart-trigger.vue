<template>
  <div class="cart-trigger">
    <div class="cart-trigger__inner">
      <a
        href="/cart"
        :aria-label="title"
        aria-pressed="false"
        role="button"
        :class="['cart-trigger__button', {'cart-trigger__button--empty': cartCount === 0}]"
      >
        <slot name="icon" />
        <span
          v-if="cartCount > 0"
          class="badge cart-trigger__count"
        >
          <span class="cart-trigger__count-text cart-trigger-count-text">
            {{ cartCount }}
          </span>
        </span>
      </a>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    isDropdownMobile: Boolean
  },
  computed: {
    cartCount () {
      const cart = this.$store.getters['cartLayout/cart']
      return (cart && cart.item_count) || 0
    }
  },
  watch: {
    globalCart: {
      handler (globalCart) {
        this.cartCount = globalCart.item_count
      },
      deep: false,
      immediate: false
    }
  }
}
</script>
