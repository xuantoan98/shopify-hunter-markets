<template>
  <div
    :class="['expand', { 'is-expanded': state.isExpanded }]"
    @mouseenter="!isMobile && expand()"
  >
    <slot />
  </div>
</template>

<script>
let staticId = 0

export default {
  // These injections are from <ExpandGroup> which maintains
  // grouped state for each group of expand elements
  inject: ['expandGroupState', 'expandItem', 'collapseItem'],
  provide () {
    return {
      state: this.state,
      expand: this.expand,
      collapse: this.collapse,
      toggle: this.toggle
    }
  },
  props: {
    id: {
      type: [String, Number],
      default () {
        staticId++
        return staticId
      }
    }
  },
  data () {
    return {
      state: {
        isExpanded: false,
        isTransitioning: false
      }
    }
  },
  watch: {
    expandGroupState: {
      handler (newState) {
        this.state.isTransitioning = newState.isTransitioning
        this.state.isExpanded = newState.expandedId === this.id
      },
      deep: true
    }
  },
  methods: {
    toggle (e) {
      e.preventDefault()
      if (this.state.isExpanded) {
        this.collapse()
      } else {
        this.expand()
      }
    },
    expand () {
      if (this.expandItem) {
        this.expandItem(this.id)
      } else {
        this.state.isExpanded = true
      }
      this.$emit('expand')
    },
    collapse () {
      if (this.collapseItem) {
        this.collapseItem(this.id)
      } else {
        this.state.isExpanded = false
      }
      this.$emit('collapse')
    }
  }
}
</script>
