<template>
  <button
    :class=" ['search-trigger', className]"
    aria-label="Search"
    aria-pressed="false"
    @click.prevent="$store.dispatch('popupCollection/activate', 'modal-search')"
  >
    <svg
      viewBox="0 0 20 20"
      class="icon header__icon header__search-icon"
    >
      <use
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xlink:href="#icon-search"
        x="0"
        y="0"
      />
    </svg>
  </button>
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
