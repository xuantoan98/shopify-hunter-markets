<template>
  <div class="carousel-group">
    <slot
      v-bind="{ registerCarousel, updateIndex }"
    />
  </div>
</template>

<script>
import { map } from 'lib/utils'

export default {
  props: {
    isUpdateCarouselsInstantly: Boolean
  },
  data () {
    return {
      carouselComponents: [],
      currentIndex: 0
    }
  },
  watch: {
    currentIndex (newValue, oldValue) {
      if (newValue !== oldValue && this.carouselComponents.length > 1) {
        map(carouselComponent => {
          const currentIndex = carouselComponent.getCurrentIndex()
          if (currentIndex !== this.currentIndex) {
            carouselComponent.select(this.currentIndex, this.isUpdateCarouselsInstantly)
          }
        }, this.carouselComponents)
      }
    }
  },
  methods: {
    updateIndex (index) {
      this.currentIndex = index
    },
    registerCarousel (instance) {
      this.carouselComponents.push(instance)
    }
  }
}
</script>
