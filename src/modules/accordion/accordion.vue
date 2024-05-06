<template>
  <div :class="['accordion', className, {'accordion--disabled': !isActive}]">
    <slot />
  </div>
</template>

<script>
import throttle from 'lodash.throttle'
import { on } from 'lib/dom'
import { map } from 'lib/utils'

export default {
  props: {
    className: {
      type: String,
      default: ''
    },
    watchCss: Boolean,
    isSingle: Boolean
  },
  data () {
    return {
      isActive: true,
      blocks: []
    }
  },
  provide () {
    return {
      registerBlock: this.registerBlock.bind(this)
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
    if (this.isActive && this.isSingle) {
      map(block => {
        block.$on('activate-block', (blockId) => {
          this.activateSingleBlock(blockId)
        })
      }, this.blocks)
    }
  },
  methods: {
    init () {
      this.isActive = true
      map(block => block.deactivate(), this.blocks)
    },
    destroy () {
      this.isActive = false
      map(block => block.activate(), this.blocks)
    },
    registerBlock (block) {
      this.blocks.push(block)
    },
    handleWatchCss () {
      const afterContent = window.getComputedStyle(this.$el, ':after').content
      if (afterContent.includes('accordion')) {
        this.init()
      } else {
        this.destroy()
      }
    },
    activateSingleBlock (blockId) {
      map(block => {
        if (block.uuid !== blockId) {
          block.deactivate()
        }
      }, this.blocks)
    }
  }
}
</script>
