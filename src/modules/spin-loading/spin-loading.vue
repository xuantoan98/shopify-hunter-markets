<template>
  <div :class="['spin-loading', className]">
    <span class="spin-loading__icon" />
  </div>
</template>

<script>
export default {
  props: {
    className: {
      type: String,
      default: ''
    }
  }
}
</script>
