<template>
  <div :class=" ['cart-row', className]">
    <div class="cart-row__inner">
      <slot
        name="image"
        v-bind="{ value }"
      >
        <a
          :href="value.url"
          class="cart-row__col cart-row__image"
        >
          <image-lazy
            :cover="true"
            :image-url="value.image"
          />
        </a>
      </slot>
      <slot
        name="content"
        v-bind="{ value, quantity, max, changeQuantity, remove, removeText, comparePrice }"
      >
        <div class="cart-row__col cart-row__col--content">
          <div class="cart-row__header">
            <h4 class="cart-row__title">
              <a
                class="cart-row-title cart-row__title-link"
                :href="value.url"
              >
                {{ value.product_title }}
              </a>
            </h4>
            <div class="cart-row__info">
              <!-- eslint-disable -->
              <p
                v-if="value.options_with_values[0].value !== 'Default Title'"
                v-for="option in value.options_with_values"
                :key="option.name"
                class="cart-row__variant cart-row-variant"
                v-html="option.name + ': ' + option.value"
              />
              <!-- eslint-enable -->
            </div>
            <button
              class="link cart-row__close"
              type="button"
              @click="remove"
            >
              {{ removeText }}
            </button>
          </div>
          <div class="cart-row__price">
            <price
              class="price--small price--vertical"
              :original-price="comparePrice"
              :price="value['price']"
            />
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import { formatMoney } from 'lib/shopify'

export default {
  props: {
    className: {
      type: String,
      default: ''
    },
    removeText: {
      type: String,
      default: 'Remove'
    },
    value: {
      type: Object,
      default: () => ({})
    },
    lineIndex: {
      type: Number,
      default: 0
    },
    isAutoUpdateCart: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      extras_loading: true,
      quantity: this.value.quantity
    }
  },
  computed: {
    max () {
      return this.value.inventory_quantity ? this.value.inventory_quantity : Number.MAX_VALUE
    },
    comparePrice () {
      return this.value.compare_at_price ? this.value.compare_at_price : 0
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler (newValue) {
        if (newValue != null) {
          this.quantity = newValue.quantity
        } else {
          this.quantity = 0
        }
      }
    }
  },
  methods: {
    async remove () {
      this.$store.dispatch('cartLayout/removeFromCart', this.value)
    },
    async changeQuantity (qty) {
      this.quantity = qty
      this.$emit('input', {
        ...this.value,
        quantity: qty,
        original_line_price: qty * this.value.original_price,
        line_price: qty * this.value.price
      }, this.lineIndex)
    },
    formatMoney
  }
}
</script>
