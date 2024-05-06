<template>
  <TransitionExpand
    :mode="(state.isTransitioning && !isMobile) ? 'fade' : 'expand'"
    @got-height="setExpandGroupBackdropHeight"
  >
    <div
      v-show="state.isExpanded"
      class="expand__content"
    >
      <slot />
    </div>
  </TransitionExpand>
</template>

<script>
import TransitionExpand from 'modules/transition-expand/transition-expand.vue'

export default {
  inject: ['collapse', 'state', 'setExpandGroupBackdropHeight'],
  components: { TransitionExpand }
}
</script>
