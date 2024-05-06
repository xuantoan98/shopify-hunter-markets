<template>
  <div :class="['price', className, { 'price--sale': isOnSale }]">
    <span
      v-if="isCurrentVariant === null && enablePriceRange && (priceMin !== priceMax)"
      class="price-amount price__amount"
    >
      {{ priceRange }}
    </span>
    <div
      v-else
      class="price__inner"
    >
      <s
        v-if="isOnSale"
        class="price__slashed"
      >{{ formatMoneySale(originalPrice) }}</s>
      <span
        class="price-amount price__amount"
      >
        {{ formatMoney(price) }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
/* global Shopify */
import { formatMoney } from 'lib/shopify'

export default {
  props: {
    variant: {
      type: Object,
      default: () => ({})
    },
    price: {
      type: Number,
      default: null
    },
    originalPrice: {
      type: Number,
      default: null
    },
    className: {
      type: String,
      default: ''
    },
    isCurrentVariant: {
      type: Object,
      default: null
    },
    enablePriceRange: {
      type: Boolean,
      default: false
    },
    priceMax: {
      type: Number,
      default: null
    },
    priceMin: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapState(['defaultCurrency']),
    isOnSale () {
      return this.originalPrice > this.price
    },
    priceRange () {
      const priceRangeString = this.priceMin === this.priceMax
        ? `${this.formatMoney(this.priceMax)}`
        : `${this.formatMoney(this.priceMin)} - ${this.formatMoney(this.priceMax)}`
      return priceRangeString
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    formatMoney (price) {
      return (Shopify.currency.active === this.defaultCurrency) ? `${formatMoney(price)}` : `${Shopify.currency.active} ${formatMoney(price)}`
    },
    formatMoneySale (price) {
      return formatMoney(price)
    }
  }
}
</script>
