<template>
  <card
    ref="card"
    :title="productData.title"
    :cta-primary-url="productData.url"
    :featured-image="productData.featured_image"
    :second-image="secondImage"
    :class-name="'card--product ' + className"
  >
    <template v-slot:before-content>
      <div
        v-if="productAvailable"
        class="card__label"
      >
        <span>{{ productAvailable }}</span>
      </div>
    </template>
    <template v-slot:description>
      <price
        :price="productData.entity.price"
        :original-price="productData.entity.compare_at_price_min"
        class-name="price--card"
      />
    </template>
    <template v-slot:ctas>
      <product-form
        v-if="showProductForm"
        :variants="variants"
        :options="options"
        :product="product"
        :product-id="productData.id"
      />
    </template>
    <template v-slot:after-content>
      <div v-if="showColorSwatch">
        <product-linked
          class-name="product-linked--card"
          :current-product="productData.entity"
          :products="productData.linked_products"
          :show-pattern="showPattern"
          :is-update-inline="isUpdateInline"
          @update-swatch="updateSwatch"
        />
      </div>
    </template>
  </card>
</template>

<script>
export default {
  props: {
    className: {
      type: String,
      default: ''
    },
    initData: {
      type: Object,
      default: () => ({})
    },
    showColorSwatch: Boolean,
    showQuickView: Boolean,
    showProductForm: Boolean,
    showPattern: {
      type: Boolean,
      default: true
    },
    isUpdateInline: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      product: null,
      productData: null,
      options: [],
      variants: []
    }
  },
  computed: {
    productAvailable () {
      return this.product.available ? '' : 'Gone'
    }
  },
  created () {
    let json = this.initData
    this.assignProductData(json)
  },
  methods: {
    async fetchProduct (handle) {
      const response = await fetch(`/products/${handle}?view=ajax`)
      return response.json()
    },
    assignProductData (json) {
      this.productData = json
      this.product = json['entity']
      this.options = json['entity']['options']
      this.variants = json['entity']['variants'].map(
        variant => ({
          ...variant,
          ...json['variants_data'][variant.id]
        })
      )
      this.secondImage = this.product.images && this.product.images.length > 1 ? this.product.images[1] : null
    },
    async updateSwatch (handle) {
      let json = await this.fetchProduct(handle)
      this.assignProductData(json)
    },
    getImageEl () {
      return this.$refs.card ? this.$refs.card.getImageEl() : undefined
    }
  }
}
</script>
