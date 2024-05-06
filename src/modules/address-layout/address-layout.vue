<template>
  <div>
    <slot v-bind="{ handleButton, isEnableForm }" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      isEnableForm: false
    }
  },
  methods: {
    handleButton () {
      this.isEnableForm = !this.isEnableForm
    }
  }
}
</script>
