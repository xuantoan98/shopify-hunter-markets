<template>
  <div
    :is="tag"
    class="expand__title"
    @click="handleToggle"
  >
    <slot />
  </div>
</template>
<script>
export default {
  inject: ['toggle', 'collapse', 'state'],
  props: {
    tag: {
      type: String,
      default: 'div'
    }
  },
  methods: {
    handleToggle (e) {
      if (!this.isDesktop) {
        e.preventDefault()
        this.toggle(e)
      }
    }
  }

}
</script>
