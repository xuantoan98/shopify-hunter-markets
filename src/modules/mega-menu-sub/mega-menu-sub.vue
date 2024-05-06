<template>
  <Expand>
    <slot />
  </Expand>
</template>

<script>
import Expand from 'modules/expand/expand.vue'

export default {
  components: { Expand }
}
</script>
