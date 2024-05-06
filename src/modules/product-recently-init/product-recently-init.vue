<template>
  <div />
</template>

<script>
export default {
  props: {
    currentProductHandle: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      productRecentlyHandle: null
    }
  },
  mounted () {
    this.productRecentlyHandle = JSON.parse(localStorage.getItem('product_recently_handles'))
    this.addRecentlyHandle(this.currentProductHandle)
  },
  methods: {
    addRecentlyHandle (handle) {
      if (!this.productRecentlyHandle) {
        localStorage.setItem('product_recently_handles', JSON.stringify([
          handle
        ]))
      } else {
        if (!this.productRecentlyHandle.includes(handle)) {
          this.productRecentlyHandle.push(handle)

          if (this.productRecentlyHandle.length > 6) {
            this.productRecentlyHandle.shift()
          }
        }
        localStorage.setItem('product_recently_handles', JSON.stringify(this.productRecentlyHandle))
      }
    }
  }
}
</script>
