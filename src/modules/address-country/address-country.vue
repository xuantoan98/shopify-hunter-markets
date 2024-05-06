<template>
  <div
    :class="['address-country', className]"
  >
    <slot v-bind="{ countryOptions, dataProvince, selectedCountry, showProvince, valueProvince, formatDefaultCountry }" />
  </div>
</template>

<script>
/* eslint-disable */
const regex = /\"(.*?)\"|\>(.*?)\</g
const regexString = /\"|%26quot;|[(\[\])]/g
const regexEndLabel = /%26/g
/* eslint-enable */

export default {
  props: {
    countryData: {
      type: String,
      default: 'country'
    },
    defaultCountry: {
      type: String,
      default: ''
    },
    defaultProvince: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      listCountry: [],
      listProvince: [],
      listCountryName: [],
      countryOptions: null,
      dataProvince: null,
      showProvince: false,
      formatDefaultCountry: this.defaultCountry,
      valueProvince: this.defaultProvince
    }
  },
  created () {
    let data = this.decodeUrl(this.countryData)
    this.getData(data)

    if (this.listCountry.length) {
      this.countryOptions = this.listCountry.map((item, index) => {
        return {
          name: this.listCountryName[index],
          value: item,
          option: item
        }
      })
    }
    this.selectedCountry()
    this.getDefaultCountry()
  },
  updated () {
    if (this.dataProvince.length) {
      this.valueProvince = this.dataProvince[0].value
    }
  },
  methods: {
    decodeUrl (data) {
      return decodeURI(data)
    },
    handleProvince (data) {
      let value = data.replace(regexString, '')
      return value === '' ? null : [...new Set(value.split(','))]
    },
    getData (data) {
      let result = data.match(regex)
      if (result.length) {
        let listCountry = result.filter((item, index) => index % 3 === 0)
        this.listCountry = listCountry.map(item => item.replace(regexString, ''))
        let listProvince = result.filter((item, index) => index % 3 === 1)
        this.listProvince = listProvince.map(item => this.handleProvince(item))
        let listCountryName = result.filter((item, index) => index % 3 === 2)
        this.listCountryName = listCountryName.map(item => item.replace(regexEndLabel, '&').replace('<', '').replace('>', ''))
      }
    },
    selectedCountry (value) {
      let dataValue = value
      if (dataValue === undefined) {
        this.getDefaultCountry()
        dataValue = this.formatDefaultCountry
      }

      let indexCountry = 0
      this.listCountry.forEach((item, index) => {
        if (item === dataValue) {
          indexCountry = index
        }
      })
      let dataProvince = this.listProvince[indexCountry]
      if (dataProvince && dataProvince.length) {
        this.dataProvince = dataProvince.map(item => {
          return {
            name: item,
            value: item,
            option: item
          }
        })
        this.showProvince = false
        this.$nextTick(() => {
          this.showProvince = false
          this.$nextTick(() => {
            this.showProvince = true
          })
        })
      } else {
        this.dataProvince = []
        this.showProvince = false
      }
    },
    getDefaultCountry () {
      const getIndex = this.listCountryName.findIndex(item => item === this.defaultCountry)
      this.formatDefaultCountry = this.listCountry[getIndex]
    }
  }
}
</script>
