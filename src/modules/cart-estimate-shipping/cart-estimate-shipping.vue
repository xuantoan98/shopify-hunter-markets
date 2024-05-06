<script>
import { getShipping, formatMoney } from 'lib/shopify'

export default {
  data () {
    return {
      zip: '',
      country: 'Australia',
      province: 'Australian Capital Territory',
      successful_message: '',
      error_message: '',
      loaded: false
    }
  },
  methods: {
    async getEstimate () {
      this.error_message = ''
      this.successful_message = ''
      if (this.zip) {
        const address = {
          country: this.country,
          province: this.province,
          zip: this.zip
        }
        const results = await getShipping(address)
        if (results.error) {
          this.error_message = `Postcode "${this.zip}" ${results.error.zip[0]}`
        } else if (results.shipping_rates.length) {
          const result = results.shipping_rates[0]
          this.successful_message = result.presentment_name + ': ' + formatMoney(result.price)
        }
      }
    }
  }
}
</script>
