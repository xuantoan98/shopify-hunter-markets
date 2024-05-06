<template>
  <div :class="['show-more', sectionClass]">
    <div :class="gridClass">
      <slot />
      <slot
        v-if="showContent"
        name="more"
      />
    </div>
    <button
      v-if="!hideButton"
      :class="buttonClass"
      @click="showAll"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script>
import throttle from 'lodash.throttle'
import { on } from 'lib/dom'
export default {
  props: {
    sectionClass: {
      type: String,
      default: 'shopify-section'
    },
    gridClass: {
      type: String,
      default: 'grid'
    },
    buttonClass: {
      type: String,
      default: 'button'
    },
    buttonText: {
      type: String,
      default: 'Show More'
    },
    watchCss: Boolean
  },
  data () {
    return {
      hideButton: false,
      showContent: false,
      isClick: false
    }
  },
  mounted () {
    if (this.watchCss) {
      this.handleWatchCss()
      let windowWidth = window.innerWidth
      on('resize', throttle(() => {
        if (windowWidth !== window.innerWidth) {
          this.handleWatchCss()
          windowWidth = window.innerWidth
        }
      }, 100), window)
    }
  },
  methods: {
    showAll () {
      this.hideButton = true
      this.showContent = true
      this.isClick = true
    },
    reset () {
      this.hideButton = false
      this.showContent = false
    },
    handleWatchCss () {
      const content = window.getComputedStyle(this.$el, 'after').content
      if (!content.includes('show-more')) {
        this.showAll()
      } else {
        if (!this.isClick) {
          this.reset()
        }
      }
    }
  }
}
</script>
