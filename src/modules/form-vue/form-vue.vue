<template>
  <validation-observer
    v-slot="{ handleSubmit }"
    tag="div"
  >
    <slot v-bind="{ handleSubmit, submitForm }" />
  </validation-observer>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import { select } from 'lib/dom'

export default {
  components: {
    'validation-observer': ValidationObserver
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    validation: Boolean
  },
  data () {
    return {
      noticeSuccessId: '',
      noticeErrorId: ''
    }
  },
  mounted () {
    this.noticeError()
    this.noticeSuccess()
  },
  updated () {
    this.noticeError()
    this.noticeSuccess()
  },
  methods: {
    submitForm () {
      const form = select('form', this.$el)
      if (form !== undefined) {
        form.submit()
      }
    },
    noticeError () {
      this.noticeErrorId = `form-${this.name}-error`
      this.$store.dispatch('popupCollection/activate', this.noticeErrorId)
    },
    noticeSuccess () {
      this.noticeSuccessId = `form-${this.name}-success`
      this.$store.dispatch('popupCollection/activate', this.noticeSuccessId)
    }
  }
}
</script>
