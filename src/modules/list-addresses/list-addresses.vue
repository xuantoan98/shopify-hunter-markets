<script>
export default {
  props: {
    addressesSize: {
      type: Number,
      required: true
    }
  },
  data: function () {
    let addresses = {}
    for (let i = 0; i < this.addressesSize; i++) {
      addresses[i + 1] = false
    }
    return {
      addresses
    }
  },
  methods: {
    openEditing: function (index) {
      this.addresses[index] = true
    },
    closeEditing: function (index) {
      this.addresses[index] = false
    }
  }
}
</script>
