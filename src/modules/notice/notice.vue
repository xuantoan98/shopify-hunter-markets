<template>
  <div
    v-if="isDisplayed"
    :id="id"
    :class="['notice', `notice--${finalType}`, className, { 'notice--active': isDisplayed }, {'notice--inline': isInline}]"
  >
    <div class="normal-case notice__message">
      <template>
        <svg
          v-if="finalType === 'success'"
          class="notice__icon"
          viewBox="0 0 16 16"
        >
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#icon-tick"
            x="0"
            y="0"
          />
        </svg>
        <svg
          v-else-if="finalType === 'error'"
          class="notice__icon"
          viewBox="0 0 16 16"
        >
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#icon-error"
            x="0"
            y="0"
          />
        </svg>
        <svg
          v-else
          class="notice__icon"
          viewBox="0 0 16 16"
        >
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#icon-bell"
            x="0"
            y="0"
          />
        </svg>
      </template>
      <!-- eslint-disable -->
      <div v-if="globalMessage && isGlobal" v-html="globalMessage" />
      <!-- eslint-enable -->
      <slot v-else />
    </div>
    <button
      class="notice__close-button"
      @click="hide"
    >
      <svg
        viewBox="0 0 320 512"
        class="notice__icon-close"
      >
        <use
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#icon-close"
          x="0"
          y="0"
        />
      </svg>
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { popupMixin } from 'lib/vue/mixins'
import { clearAllBodyScrollLocks } from 'lib/bodyScrollLock'

const GLOBAL_ID = 'notice-global'

export default {
  mixins: [popupMixin],
  props: {
    isActivateImmediately: Boolean,
    isInline: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default'
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  computed: {
    ...mapState('noticeTrigger', {
      globalType: 'type',
      globalDuration: 'duration',
      globalMessage: 'message'
    }),
    groupType () {
      return 'notice'
    },
    isGlobal () {
      return this.id === GLOBAL_ID
    },
    finalType () {
      return this.isGlobal ? this.globalType : this.type
    },
    finalDuration () {
      return this.isGlobal ? this.globalDuration : this.duration
    }
  },
  watch: {
    isDisplayed (newValue) {
      if (newValue && !this.isInline && this.finalDuration > 0) {
        setTimeout(this.hide, this.finalDuration)
      }
      if (!newValue && this.isGlobal) {
        this.$store.dispatch('noticeTrigger/changeMessage', { message: '' })
      }
      this.$nextTick(() => {
        clearAllBodyScrollLocks()
      })
    },
    globalMessage (newValue) {
      if (this.isGlobal && newValue) {
        this.$store.dispatch('popupCollection/activate', this.id)
      }
    }
  },
  mounted () {
    if (this.isActivateImmediately) {
      this.$store.dispatch('popupCollection/activate', this.id)
    }
  }
}
</script>
