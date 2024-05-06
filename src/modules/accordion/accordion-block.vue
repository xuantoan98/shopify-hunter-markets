<template>
  <div
    :id="id"
    :class="['accordion__block', className, {'accordion__block--active': isActive}]"
  >
    <div
      class="label accordion__label"
      @click="maybeActivate()"
    >
      <slot name="header" />
    </div>
    <collapse-transition
      :duration="duration"
      tag="div"
    >
      <div
        v-if="isActive"
        class="accordion__content"
      >
        <div class="accordion__content-inner">
          <slot name="content" />
        </div>
      </div>
    </collapse-transition>
  </div>
</template>
<script>
import { CollapseTransition } from 'vue2-transitions'
import { scrollRevealing } from 'lib/scrollRevealing'

let uuid = 0

export default {
  components: {
    CollapseTransition
  },
  inject: ['registerBlock'],
  props: {
    id: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 400
    },
    active: Boolean
  },
  data () {
    return {
      isActive: this.active,
      uuid
    }
  },
  created () {
    uuid++
  },
  mounted () {
    this.registerBlock(this)
  },
  methods: {
    maybeActivate () {
      this.isActive = !this.isActive
      if (this.isActive) {
        this.$emit('activate-block', this.uuid)
        this.$nextTick(() => {
          scrollRevealing(this.$el)
        })
      }
    },
    activate () {
      this.isActive = true
    },
    deactivate () {
      this.isActive = false
    }
  }
}
</script>
