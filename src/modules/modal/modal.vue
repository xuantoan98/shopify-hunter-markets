<template>
  <div
    :id="id"
    :class="['modal', className, {'modal--active': isDisplayed}]"
  >
    <div
      class="modal__overlay js-modal-overlay"
      @click="hide"
    />
    <div class="modal__wrapper">
      <div class="modal__header">
        <button
          type="button"
          class="modal__button js-modal-button"
          aria-label="Close a modal"
          @click="hide"
        >
          <span class="modal__button-close icon-close" />
        </button>
        <h3
          v-if="title"
          class="modal__title"
        >
          {{ title }}
        </h3>
      </div>
      <div class="modal__inner">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script>
import { popupMixin } from 'lib/vue/mixins'

export default {
  mixins: [popupMixin],
  props: {
    className: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    scrollTarget: {
      type: String,
      default: ''
    }
  }
}
</script>
