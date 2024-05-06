<template>
  <div class="product-detail">
    <div class="product-details__left">
      <product-images
        :images="productImages"
        :use-carousel-image-thumbnail="useCarouselImageThumbnail"
      />
    </div>
    <div class="product-details__right">
      <h1 class="h4 product-header__title">
        {{ product.title }}
      </h1>
      <price
        v-if="isAvailable"
        :price="price"
        :original-price="originalPrice"
        class="price--product"
      />
      <p v-else>
        {{ soldOutText }}
      </p>
      <product-form
        :options="options"
        :variants="variants"
        :product="product"
        :product-id="product.id"
        :show-quantity="showQuantity"
        :show-low-stock="showLowStock"
        :show-size-guide="showSizeGuide"
        @select-variant="selectVariant"
      />
    </div>
  </div>
</template>
<script>
import { filter } from 'lib/utils'
import { trigger } from 'lib/dom'

export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    handle: {
      type: String,
      default: ''
    },
    productData: {
      type: Object,
      default: () => ({})
    },
    soldOutText: {
      type: String,
      default: 'Sold Out'
    },
    variantsType: {
      type: String,
      default: ''
    },
    featuredImage: Boolean,
    showQuantity: {
      type: Boolean,
      default: true
    },
    showLowStock: {
      type: Boolean,
      default: true
    },
    showSizeGuide: {
      type: Boolean,
      default: true
    },
    useCarouselImageThumbnail: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isLoaded: false,
      currentVariant: null,
      product: null,
      productImages: [],
      options: [],
      variants: []
    }
  },
  computed: {
    images () {
      return filter((image, index) => !this.featuredImage || index === 0, this.productImages)
    },
    originalPrice () {
      return (this.currentVariant || this.product)['compare_at_price']
    },
    price () {
      return (this.currentVariant || this.product)['price']
    },
    isAvailable () {
      return this.product.available &&
        (!this.currentVariant || this.currentVariant['inventory_quantity'] > 0)
    }
  },
  async created () {
    // prefer to use the liquid data if available
    let json = this.productData

    // if liquid data is not available, load this via AJAX
    if (!json) {
      json = await this.fetchProduct()
    }

    this.product = json['entity']

    this.productImages = json['images']

    this.options = json['entity']['options']
    this.variants = json['entity']['variants'].map(
      variant => ({
        ...variant,
        ...json['variants_data'][variant.id]
      })
    )

    this.isLoaded = true

    trigger('load-swym-snippet', window)
  },
  methods: {
    async fetchProduct () {
      const response = await fetch(`/products/${this.handle}?view=ajax`)
      return response.json()
    },
    selectVariant (currentVariant) {
      this.currentVariant = currentVariant
    }
  }
}
</script>
