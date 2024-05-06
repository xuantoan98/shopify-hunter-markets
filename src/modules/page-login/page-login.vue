<template>
  <div class="entry-form entry-form--login">
    <slot v-bind="{ loginForm, isActives }" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      isActives: true
    }
  },
  created () {
    if (window.location.href.match(/#recover/)) {
      this.isActives = false
    }
  },
  methods: {
    loginForm () {
      this.isActives = !this.isActives
    }
  }
}
</script>
