<template>
  <div :class="['image-zoom', className]">
    <div
      v-touch:start="handleTouchStartEvents"
      v-touch:end="handleTouchEnd"
      class="image-zoom__inner"
      @mousemove="handleMouseMoveEvents($event)"
      @mouseleave="handleImageUnzoom"
      @touchmove="handleTouchMoveEvents($event)"
      @click="changeMobileZoomAllowance"
    >
      <image-lazy
        ref="imageContainer"
        :class="'image-zoom__image ' + imageClass"
        :cover="cover"
        :contain="contain"
        :image-url="image"
      />
      <div
        ref="zoomer"
        class="image-zoom__background"
        :style="{ backgroundImage: 'url(\'' + image + '\')' }"
      />
    </div>
  </div>
</template>

<script>
import { setStyle } from 'lib/dom'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'lib/bodyScrollLock'

const MOBILE_BREAKPOINT = 768
const ZOOM_EDGE = 15
const SCROLL_THRESHOLD = 580

export default {
  props: {
    image: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    imageClass: {
      type: String,
      default: ''
    },
    imageAlt: {
      type: String,
      default: ''
    },
    cover: Boolean,
    contain: Boolean
  },
  data () {
    return {
      timer: null,
      taps: 0,
      allowMobileZoom: false,
      touchStartOffset: { x: 0, y: 0 },
      currentZoomPosition: { x: 0, y: 0 },
      lastZoomPosition: { x: 50, y: 50 }
    }
  },
  watch: {
    allowMobileZoom (newValue) {
      this.$emit('toggle-dragging-carousel', newValue)
      if (this.isMobile) {
        if (newValue) {
          this.currentZoomPosition = { x: 50, y: 50 }
          this.lastZoomPosition = { ...this.currentZoomPosition }
          this.handleImageZoom(50, 50)
        } else {
          this.handleImageUnzoom()
        }
      } else if (!newValue) {
        this.handleImageUnzoom()
      }
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScrollOnMobile)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScrollOnMobile)
  },
  methods: {
    handleTouchStartEvents (e) {
      if (e.touches) {
        const zoomer = this.$refs['zoomer'][0] || this.$refs.zoomer
        this.touchStartOffset = {
          x: e.touches[0].clientX - zoomer.getBoundingClientRect().left,
          y: e.touches[0].clientY - zoomer.getBoundingClientRect().top
        }
      }
    },
    handleTouchMoveEvents (e) {
      const zoomer = this.$refs['zoomer'][0] || this.$refs.zoomer
      if (this.allowMobileZoom && this.isMobile) {
        disableBodyScroll(zoomer)
      } else {
        return
      }
      let offsetX = e.touches[0].clientX - zoomer.getBoundingClientRect().left
      let offsetY = e.touches[0].clientY - zoomer.getBoundingClientRect().top
      let distanceX = (offsetX - this.touchStartOffset.x) / zoomer.offsetWidth * 100
      let distanceY = (offsetY - this.touchStartOffset.y) / zoomer.offsetHeight * 100
      let x = this.lastZoomPosition.x - distanceX > 100 ? 100 : this.lastZoomPosition.x - distanceX < 0 ? 0 : this.lastZoomPosition.x - distanceX
      let y = this.lastZoomPosition.y - distanceY > 100 ? 100 : this.lastZoomPosition.y - distanceY < 0 ? 0 : this.lastZoomPosition.y - distanceY
      this.currentZoomPosition = { x, y }
      this.handleImageZoom(x, y)
    },
    handleMouseMoveEvents (e) {
      if (this.isMobile) {
        return
      }
      const zoomer = this.$refs['zoomer'][0] || this.$refs.zoomer
      let offsetX = e.offsetX
      let offsetY = e.offsetY
      let x = offsetX > (zoomer.offsetWidth - ZOOM_EDGE) ? 100 : (offsetX < ZOOM_EDGE ? 0 : offsetX / zoomer.offsetWidth * 100)
      let y = offsetY > (zoomer.offsetHeight - ZOOM_EDGE) ? 100 : (offsetY < ZOOM_EDGE ? 0 : offsetY / zoomer.offsetHeight * 100)
      this.handleImageZoom(x, y)
    },
    handleImageZoom (x, y) {
      const zoomer = this.$refs['zoomer'][0] || this.$refs.zoomer
      const imageContainer = this.$refs['imageContainer'][0] || this.$refs.imageContainer
      const imageEl = imageContainer.$refs['image'] || imageContainer.$refs.image
      setStyle('background-position', `${x}% ${y}%`, zoomer)
      setStyle('background-size', '250%', zoomer)
      setStyle('opacity', '1', zoomer)
      setStyle('opacity', '0', imageEl)
    },
    handleImageUnzoom () {
      const zoomer = this.$refs['zoomer'][0] || this.$refs.zoomer
      const imageContainer = this.$refs['imageContainer'][0] || this.$refs.imageContainer
      const imageEl = imageContainer.$refs['image'] || imageContainer.$refs.image
      setStyle('background-position', '50% 50%', zoomer)
      setStyle('background-size', '0', zoomer)
      setStyle('opacity', '0', zoomer)
      setStyle('opacity', '1', imageEl)
      clearAllBodyScrollLocks()
      this.touchStartOffset = { x: 0, y: 0 }
      this.currentZoomPosition = { x: 0, y: 0 }
      this.lastZoomPosition = { x: 50, y: 50 }
    },
    changeMobileZoomAllowance (e) {
      const delay = 700

      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        this.taps++
        if (this.taps === 1) {
          this.allowMobileZoom = !this.allowMobileZoom
          this.timer = setTimeout(() => {
            this.taps = 0
          }, delay)
        } else {
          clearTimeout(this.timer)
          this.taps = 0
        }
      }
    },
    handleTouchEnd () {
      this.lastZoomPosition = { ...this.currentZoomPosition }
      clearAllBodyScrollLocks()
    },
    handleScrollOnMobile () {
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        if (window.scrollY > SCROLL_THRESHOLD && this.allowMobileZoom) {
          this.allowMobileZoom = false
        }
      }
    }
  }
}
</script>
