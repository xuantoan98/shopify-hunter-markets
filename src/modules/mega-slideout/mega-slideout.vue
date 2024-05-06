<template>
  <Slideout
    v-if="isMobile"
    v-bind="$attrs"
  >
    <template v-slot:header>
      <slot name="header" />
    </template>
    <slot />
  </Slideout>
  <div
    v-else
  >
    <slot />
  </div>
</template>

<script>
import Slideout from 'modules/slideout/slideout.vue'

export default {
  components: { Slideout },
  inheritAttrs: false
}
</script>
