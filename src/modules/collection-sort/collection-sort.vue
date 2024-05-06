<template>
  <div class="collection-sort">
    <slot v-bind="{ checkSelected }" />
  </div>
</template>
<script>

export default {
  methods: {
    checkSelected ($event) {
      const urlSearchParams = new URLSearchParams(window.location.search)
      urlSearchParams.set('sort_by', $event)
      window.location = `?${urlSearchParams}`
    }
  }
}
</script>
