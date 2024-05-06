<template>
  <div
    v-cloak
    :class="['slideout', { 'slideout--active': isDisplayed }, classNames]"
    role="dialog"
  >
    <div
      class="slideout__wrapper"
    >
      <button
        class="slideout__button"
        @click="hide"
      >
        <slot name="close-icon">
          <svg
            class="icon slideout__close-icon"
            viewBox="0 0 12 12"
          >
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="#icon-close-2"
              x="0"
              y="0"
            />
          </svg>
        </slot>
      </button>
      <div
        ref="inner"
        class="slideout__inner"
      >
        <div
          v-show="$slots.header"
          class="slideout__header"
        >
          <slot name="header" />
        </div>

        <slot />
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="isDisplayed"
        class="slideout__overlay"
        @click="hide"
      />
    </transition>
  </div>
</template>

<script>
import { popupMixin } from 'lib/vue/mixins'

export default {
  mixins: [popupMixin],
  props: {
    classNames: {
      type: [String, Array],
      default: ''
    },
    scrollTarget: {
      type: String,
      default: ''
    }
  },
  computed: {
    groupType () {
      return 'slideout'
    }
  }
}
</script>
