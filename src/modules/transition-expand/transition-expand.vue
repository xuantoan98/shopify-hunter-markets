<template>
  <transition
    @before-enter="reset"
    @after-leave="reset"
    @enter="enter"
    @leave="leave"
    @enter-cancelled="cancel"
    @leave-cancelled="cancel"
  >
    <slot />
  </transition>
</template>

<script>
import Tweezer from 'tweezer.js'
import { getHeight, getStyle, setStyle } from 'lib/dom'

const MODE_FADE = 'fade'
const MODE_EXPAND = 'expand'

export default {
  props: {
    duration: {
      type: Number,
      default: 400
    },
    mode: {
      type: String,
      default: MODE_EXPAND,
      validator: mode => [MODE_FADE, MODE_EXPAND].includes(mode)
    }
  },
  computed: {
    isFading () {
      return this.mode === MODE_FADE
    },
    isExpanding () {
      return this.mode === MODE_EXPAND
    }
  },
  mounted () {
    const originalDisplay = getStyle('display', this.$el)

    if (originalDisplay === 'none') {
      setStyle('display', '', this.$el)
    }

    requestAnimationFrame(() => {
      this.originalHeight = getHeight(this.$el)

      if (originalDisplay === 'none') {
        setStyle('display', originalDisplay, this.$el)
      }
    })
  },
  methods: {
    reset (el) {
      if (this.isExpanding) {
        setStyle('height', '0px', el)
      } else {
        setStyle('height', '', el)
      }

      if (!this.isMobile) {
        setStyle('opacity', 0, el)
      }
    },

    enter (el, done) {
      this.$emit('got-height', this.originalHeight)

      this.currentTweezer = new Tweezer({
        start: 0,
        end: this.duration,
        duration: this.duration
      })
        .on('tick', (current) => {
          const progress = current / this.duration
          const opacity = progress

          if (this.isExpanding) {
            const height = this.originalHeight * progress
            setStyle('height', `${height}px`, el)
          }

          // on mobile, accordions don't fade
          if (!this.isMobile) {
            setStyle('opacity', opacity, el)
          }
        })

      this.currentTweezer
        .on('done', () => {
          done()
          this.currentTweezer = null
        })
        .begin()
    },

    cancel () {
      if (this.currentTweezer) {
        this.currentTweezer.stop()
        this.currentTweezer = null
      }
    },

    leave (el, done) {
      this.currentTweezer = new Tweezer({
        start: 0,
        end: this.duration,
        duration: this.duration
      })
        .on('tick', (current) => {
          const progress = current / this.duration
          const opacity = 1 - progress

          if (this.mode === MODE_EXPAND) {
            const height = (1 - progress) * this.originalHeight
            setStyle('height', `${height}px`, el)
          }

          // on mobile, accordions don't fade
          if (!this.isMobile) {
            setStyle('opacity', opacity, el)
          }
        })

      this.currentTweezer
        .on('done', () => {
          this.currentTweezer = null
          done()
        })
        .begin()
    }
  }
}
</script>
