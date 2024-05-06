<template>
  <div
    :class=" ['search-bar', className]"
  >
    <div class="container container--full search-bar__container">
      <form
        action="/search"
        method="get"
        role="search"
        class="search-bar__form"
      >
        <button
          class="search-bar__button"
          aria-label="Search"
        >
          <svg
            viewBox="0 0 15 16"
            class="search-bar__button-icon"
          >
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="#icon-search"
              x="0"
              y="0"
            />
          </svg>
        </button>
        <base-input
          class-name="form__block--search"
          :label="label"
          name="q"
          type="search"
          aria-labelledby="search-bar-label"
        />
        <input
          type="hidden"
          name="type"
          value="product"
        >
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    className: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'SEARCH'
    }
  }
}
</script>
