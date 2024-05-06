<template>
  <form
    action="/cart/add"
    method="post"
    enctype="multipart/form-data"
    class="form product-form"
    @submit.prevent="submit"
  >
    <variant-selector
      v-if="variants.length > 1 && showVariantType === 'button'"
      :options="options"
      :variants="variants"
      :is-low-stock="showLowStock"
      :is-low-stock-threshol="lowStockThreshold"
      :product-id="productId"
      :show-size-guide="showSizeGuide"
      @select-variant="selectVariant"
    />

    <variant-dropdown
      v-if="variants.length > 1 && showVariantType === 'dropdown'"
      :variants="variants"
      @select-variant="selectVariant"
    />

    <div class="form__row">
      <quantity
        v-if="showQuantity"
        v-model="quantity"
        class="form__block form__block--one-half"
        :min="1"
        :max="
          selectedVariant && selectedVariant['inventory_quantity'] > 0
            ? selectedVariant['inventory_quantity']
            : 1
        "
        :disabled="!selectedVariant"
      />

      <button
        :class="[
          'button button--secondary button--icon form__block form__block--one-half product-form__button',
        ]"
        :disabled="!selectedVariant || (selectedVariant && !isAvailable)"
      >
        <image-lazy
          v-if="iconAddToCart && isAvailable"
          :image-url="iconAddToCart"
          class="image-lazy--product-icon button__image"
          :is-src-set="false"
        />
        <span v-text="submitButtonText" />
        <spin-loading
          v-if="canAddToCart && isAdding"
          class-name="product-form__button--spinner"
        />
      </button>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
import { addToCart, getCart } from 'lib/shopify'

export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    variants: {
      type: Array,
      default: () => []
    },
    product: {
      type: Object,
      default: () => ({})
    },
    showQuantity: Boolean,
    showLowStock: Boolean,
    showSizeGuide: Boolean,
    lowStockThreshold: {
      type: Number,
      default: 0
    },
    productId: {
      type: Number,
      default: 0
    },
    showVariantType: {
      type: String,
      default: ''
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    iconAddToCart: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selectedVariant: null,
      quantity: 1,
      isAdding: false
    }
  },
  computed: {
    canAddToCart () {
      return (
        this.selectedVariant &&
        this.selectedVariant['inventory_quantity'] &&
        this.quantity > 0 &&
        this.quantity <= this.selectedVariant['inventory_quantity']
      )
    },
    submitButtonText () {
      return this.isAvailable || (!this.selectedVariant && this.isAvailable)
        ? 'Add To Cart'
        : 'Sold!'
    }
  },
  mounted () {
    if (this.variants.length === 1) {
      this.selectVariant(this.variants[0])
    }
  },
  methods: {
    selectVariant (variant) {
      this.selectedVariant = variant

      this.$emit('select-variant', variant)
    },
    async submit () {
      if (!this.canAddToCart) {
        return false
      }

      this.isAdding = true

      try {
        const lineItem = await addToCart(
          this.quantity,
          {},
          this.selectedVariant.id
        )
        await this.updateNewCart()
        this.isAdding = false
        if (lineItem) {
          this.$store.dispatch('cartLayout/addToCartPreview', lineItem)
        }
        this.openCartDropdown({ autoClose: true })
      } catch (e) {
        const message =
          'Cannot add item to cart. Please contact site administrator.'
        this.$store.dispatch('noticeTrigger/changeMessage', {
          message: message
        })
        this.$store.dispatch('noticeTrigger/changeType', { type: 'error' })
        this.$store.dispatch('noticeTrigger/changeDuration', {
          duration: 10000
        })
        console.error(e)
        this.isAdding = false
        await this.updateNewCart()
      }

      this.reset()
    },
    async updateNewCart () {
      const newCart = await getCart()
      this.$store.dispatch('cartLayout/addToCart', newCart)
    },
    reset () {
      this.quantity = 1
    },
    ...mapActions('cartTrigger', ['openCartDropdown', 'hideCartDropdown'])
  }
}
</script>
