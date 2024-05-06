<template>
  <div>
    <slot v-bind="{ products }" />
  </div>
</template>

<script>
import { fetchData } from 'lib/shopify'
export default {
  data () {
    return {
      products: null
    }
  },
  async created () {
    const initHandles = JSON.parse(localStorage.getItem('product_recently_handles'))
    if (initHandles && initHandles.length) {
      const data = await this.fetchAllRecentlyProduct(initHandles)
      if (data) {
        this.products = data.reverse()
      }
    }
  },
  methods: {
    fetchAllRecentlyProduct (handles) {
      const promises = handles.map((item) => {
        return this.fetchProduct(item)
      })
      return Promise.all(promises)
    },
    async fetchProduct (handle) {
      const response = await fetchData(`/products/${handle}?view=ajax`)
      return response
    }
  }
}
</script>
