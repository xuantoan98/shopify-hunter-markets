<template>
  <div
    :class="['tabs__panel', { 'is-active': isActive }]"
    role="tabpanel"
  >
    <slot />
  </div>
</template>

<script>
import { addClass, on, off, removeClass } from 'lib/dom'

export default {
  inject: ['registerPanel'],
  props: {
    label: {
      type: String,
      default: 'Untitled'
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isActive: null
    }
  },
  mounted () {
    if (this.active) {
      this.activate()
    }

    this.onAnimationEvents()

    this.registerPanel(this)
  },
  beforeDestroy () {
    this.offAnimationEvents()
  },
  methods: {
    activate () {
      this.isActive = true
      this.$emit('activate')
    },
    deactivate () {
      this.isActive = false
      this.$emit('deactivate')
    },
    animationEnd () {
      if (this.isActive) {
        addClass('has-entered', this.$el)
        removeClass('has-left', this.$el)
      } else {
        addClass('has-left', this.$el)
        removeClass('has-entered', this.$el)
      }
    },
    onAnimationEvents () {
      on('animationend', this.animationEnd, this.$el)
    },
    offAnimationEvents () {
      off('animationend', this.animationEnd, this.$el)
    }
  }
}
</script>
