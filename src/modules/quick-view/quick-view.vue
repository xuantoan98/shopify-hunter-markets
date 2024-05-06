<template>
  <div class="product-quick-view">
    <button
      :class="['product-quick-view__button', 'product-quick-view-button', buttonClass]"
      type="button"
      @click.prevent="$store.dispatch('popupCollection/activate', uniqueId)"
    >
      <svg
        viewBox="0 0 15 16"
        class="product-quick-view__icon"
      >
        <use
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#icon-search"
          x="0"
          y="0"
        />
      </svg>
    </button>
    <modal
      :id="uniqueId"
      class-name="modal--product"
    >
      <template v-slot:content>
        <product-detail
          data-vue
          :product-data="productData"
        />
      </template>
    </modal>
  </div>
</template>

<script>

export default {
  props: {
    buttonClass: {
      type: String,
      default: ''
    },
    productData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    uniqueId () {
      return 'modal-quick-view-' + this.productData.id
    }
  }
}
</script>
