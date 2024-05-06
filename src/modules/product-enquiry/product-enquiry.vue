<script>

export default {
  props: {
    initialModalDisplayed: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object,
      default: () => ({})
    },
    currentVariant: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isModalDisplayed: this.initialModalDisplayed
    }
  }
}
</script>
