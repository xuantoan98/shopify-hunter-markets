<template>
  <div class="page-sidebar">
    <slot v-bind="{ sidebarSelect }" />
  </div>
</template>

<script>
export default {
  methods: {
    sidebarSelect ($event) {
      window.location.href = $event
    }
  }
}
</script>
