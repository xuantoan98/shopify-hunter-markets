<template>
  <!-- eslint-disable -->
  <div :class="['more', className]">
    <div class="more__content">
      <div
        class="more__before"
        v-html="before"
      />
      <div
        ref="afterEl"
        class="more__after"
        :style="{ height: afterHeight + 'px' }"
        v-html="after"
      />
      <button
        @click="toggle"
        v-html="isExpanded ? 'Read less' : 'Read more'"
        class="more__button"
      />
    </div>
    <div v-if="isLoading && hasDefaultSlot">
      <slot />
    </div>
  </div>
</template>

<!-- eslint-enable -->
<script>
export default {
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isExpanded: false,
      before: '',
      after: '',
      afterHeight: 0,
      isLoading: true
    }
  },
  computed: {
    hasDefaultSlot () {
      return !!this.$slots.default
    }
  },
  mounted () {
    let isBefore = true

    // loop through default slot's Nodes
    for (let vnode of this.$slots.default) {
      // split the content into "before" [more] tag and after [more] tag
      if (vnode.elm.textContent && vnode.elm.textContent.trim() === '[more]') {
        isBefore = false
        continue
      }

      if (isBefore) {
        this.before += vnode.elm.outerHTML || vnode.elm.textContent
      } else {
        this.after += vnode.elm.outerHTML || vnode.elm.textContent
      }

      // delete the slot content from DOM
      this.isLoading = false
    }
  },
  methods: {
    toggle () {
      this.isExpanded = !this.isExpanded

      if (this.isExpanded) {
        this.afterHeight = this.$refs.afterEl.scrollHeight
      } else {
        this.afterHeight = 0
      }

      // delete the slot content from DOM
      this.isLoading = false
    }
  }
}
</script>
