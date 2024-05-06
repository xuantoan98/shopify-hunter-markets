<template>
  <div
    v-if="products.length"
    :class="['product-linked', className]"
  >
    <div class="product-linked__inner">
      <h2
        v-if="title"
        class="product-linked__title"
      >
        {{ title }}
      </h2>
      <div class="product-linked__content">
        <ul class="grid grid--4 product-linked__list">
          <li
            v-for="product in products"
            :key="product.id"
            :class="{'product-linked__item--current': product.id === currentProduct.id}"
            class="grid__item product-linked__item"
          >
            <a
              :title="product.color.name"
              class="product-linked__item-link"
              @click.prevent="updateSwatch(product)"
            >
              <span
                v-if="showPattern"
                class="product-linked__item-pattern"
              />
              <image-lazy
                v-else
                :image-url="product.featured_image"
                image-class="product-linked__item-img"
                :alt="product.title"
                class-name="product-linked__item-image"
              />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    className: {
      type: [String, Array],
      default: ''
    },
    currentProduct: {
      type: Object,
      default: () => ({})
    },
    products: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    showPattern: Boolean,
    isOpenProductUrl: Boolean,
    isUpdateInline: Boolean
  },
  methods: {
    updateSwatch (product) {
      if (this.isUpdateInline) {
        this.$emit('update-swatch', product.handle)
      } else {
        window.location = product.url
      }
    }
  }
}
</script>
