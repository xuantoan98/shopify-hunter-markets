<template>
  <a
    :aria-label="label"
    :aria-pressed="isPressed"
    class="nav-trigger"
    href="#slideout-menu"
    @click.prevent="toggle"
  >
    <slot>
      <div class="nav-trigger__inner">
        <span class="nav-trigger__bar nav-trigger__bar--top" />
        <span class="nav-trigger__bar nav-trigger__bar--middle" />
        <span class="nav-trigger__bar nav-trigger__bar--bottom" />
      </div>
    </slot>
  </a>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

const SLIDEOUT_ID = 'slideout-menu'

export default {
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  computed: {
    isPressed () {
      return this.isActive(SLIDEOUT_ID)
    },
    ...mapGetters('popupCollection', ['isActive'])
  },
  methods: {
    toggle () {
      if (this.isPressed) {
        this.deactivate(SLIDEOUT_ID)
      } else {
        this.activate(SLIDEOUT_ID)
      }
    },
    ...mapActions('popupCollection', ['activate', 'deactivate'])
  }
}
</script>
