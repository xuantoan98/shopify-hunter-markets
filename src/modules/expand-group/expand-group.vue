<template>
  <div
    :class="{ 'expand-group': true, 'is-group-expanded': isGroupExpanded, 'is-transitioning': expandGroupState.isTransitioning }"
    @mouseleave="resetItem"
  >
    <div
      class="expand-group__overlay"
      :style="preventFlickeringStyles"
    />
    <div
      v-cloak
      class="expand-group__backdrop"
      :style="backdropStyle"
    />
    <slot />
  </div>
</template>

<script>
import { debounce } from 'lib/utils'

const PREVENT_FLICKERING_TIMEOUT = 400
const HOVER_INTENT_TIMEOUT = 50

export default {
  provide () {
    return {
      expandGroupState: this.expandGroupState,
      setExpandGroupBackdropHeight: this.setExpandGroupBackdropHeight,
      expandItem: debounce(this.expandItem, HOVER_INTENT_TIMEOUT),
      collapseItem: this.collapseItem,
      resetItems: this.resetItems
    }
  },
  data () {
    return {
      justExpanded: false,
      expandGroupState: {
        backdropHeight: 0,
        isTransitioning: false,
        expandedId: null
      }
    }
  },
  computed: {
    isGroupExpanded () {
      return this.expandGroupState.expandedId !== null
    },
    backdropStyle () {
      const height = this.expandGroupState.expandedId ? this.expandGroupState.backdropHeight + 'px' : 0

      return {
        height
      }
    },
    preventFlickeringStyles () {
      return {
        pointerEvents: this.justExpanded ? 'all' : 'none'
      }
    }
  },
  watch: {
    isGroupExpanded (isExpanded) {
      if (isExpanded) {
        this.justExpanded = true
        setTimeout(() => {
          this.justExpanded = false
        }, PREVENT_FLICKERING_TIMEOUT)
      }
    }
  },
  methods: {
    expandItem (id) {
      if (this.expandGroupState.expandedId !== id) {
        if (this.expandGroupState.expandedId) {
          this.expandGroupState.isTransitioning = true
        }

        this.expandGroupState.expandedId = id
      }
    },
    collapseItem (id) {
      if (this.expandGroupState.expandedId === id) {
        this.expandGroupState.expandedId = null
        this.expandGroupState.isTransitioning = false
      }
    },
    resetItem () {
      this.expandGroupState.expandedId = null
      this.expandGroupState.isTransitioning = false
    },
    setExpandGroupBackdropHeight (height) {
      this.expandGroupState.backdropHeight = height
    }
  }
}
</script>
