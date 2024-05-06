<template>
  <carousel
    v-if="products.length > 0"
    :class-name="classCarousel"
    :options="carouselOptions"
  >
    <product-card
      v-for="(item, index) in products"
      ref="item"
      :key="index"
      :init-data="item"
      :class-name="classProductCard"
    />
  </carousel>
</template>

<script>
export default {
  props: {
    products: {
      type: Array,
      default: () => []
    },
    carouselOptions: {
      type: Object,
      default: () => ({})
    },
    showProductForm: Boolean,
    classCarousel: {
      type: String,
      default: ''
    },
    classProductCard: {
      type: String,
      default: ''
    }
  }
}
</script>
