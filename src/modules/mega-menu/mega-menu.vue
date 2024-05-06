<template>
  <ExpandGroup
    class="menu"
  >
    <slot />
  </ExpandGroup>
</template>

<script>
import ExpandGroup from 'modules/expand-group/expand-group.vue'

const MODE_SLIDEOUT = 'slideout'
const MODE_ACCORDION = 'accordion'

export default {
  components: { ExpandGroup },
  props: {
    level: {
      type: Number,
      default: 1
    },
    mode: {
      type: String,
      default: MODE_SLIDEOUT,
      validator: mode => [MODE_ACCORDION, MODE_SLIDEOUT].includes(mode)
    }
  }
}
</script>
