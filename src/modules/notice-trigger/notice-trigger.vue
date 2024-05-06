<template>
  <div />
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    message: {
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
    },
    isGlobal: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.message && this.isGlobal) {
        this.$store.dispatch('noticeTrigger/changeMessage', { message: this.message })
        this.$store.dispatch('noticeTrigger/changeType', { type: this.type })
        this.$store.dispatch('noticeTrigger/changeDuration', { duration: this.duration })
      } else if (this.id) {
        this.$store.dispatch('popupCollection/activate', this.id)
      }
    })
  }
}
</script>
