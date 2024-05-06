<template>
  <div class="variant-selector">
    <div
      v-for="option in options"
      :key="option"
      :class="['variant-selector__option variant-selector__option--' + option.toLowerCase()]"
    >
      <div class="variant-selector__name">
        <h5
          class="variant-selector__title"
        >
          {{ option }}
        </h5>
        <span class="variant-selector__current">{{ selected[option] }}</span>
        <span
          v-if="isLowStock && selectedVariant && selectedVariant.inventory_quantity <= lowStockThreshold"
          class="variant-selector__option-notification"
        >
          <template v-if="selectedVariant && selectedVariant.available && selectedVariant.inventory_quantity > 0">Only {{ selectedVariant.inventory_quantity }} left</template>
          <template v-else>Sold Out</template>
        </span>
        <div
          v-if="option === 'Size' && showSizeGuide"
          class="variant-selector__guide"
        >
          <a
            class="variant-selector__guide-button"
            href="#size-guide"
          >
            Size Guide
          </a>
        </div>
      </div>
      <div
        class="variant-selector__choices-wrapper"
      >
        <div
          class="variant-selector__choices"
          :class="[`variant-selector__choices--${handlize(option)}`]"
        >
          <div
            v-for="value in selectableValues[option]"
            :key="`${option}-${value}`"
            class="variant-selector__choice"
          >
            <input
              :id="radioId(option, value)"
              v-model="selected[option]"
              class="radio variant-selector__item-input"
              type="radio"
              :name="`variant[${option}]`"
              :value="value"
            >
            <label
              :class="['label label--radio variant-selector__item',{'variant-selector__item--checked': selected[option] === value}]"
              :for="radioId(option, value)"
            >
              {{ value }}
            </label>
          </div>
          <div
            v-if="showClearFilter"
            class="variant-selector__choice-clear"
            @click="clearFilterVariant(option)"
          >
            Clear
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addQueryVar } from 'lib/utils'

let uuid = 0

const handlize = (str) => {
  return str ? str.toLowerCase().split(' ').join('-') : ''
}

export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    variants: {
      type: Array,
      default: () => []
    },
    isLowStock: Boolean,
    showSizeGuide: Boolean,
    lowStockThreshold: {
      type: Number,
      default: 0
    },
    productId: {
      type: Number,
      default: 0
    },
    initialSelectedVariant: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      selected: {},
      clearAllFilter: false
    }
  },
  computed: {
    availableValues () {
      const values = {}

      for (let index in this.options) {
        const option = this.options[index]

        if (!values[option]) {
          values[option] = []
        }

        for (let variant of this.variants) {
          const value = variant.options[index]
          if (!values[option].includes(value)) {
            values[option].push(value)
          }
        }
      }

      return values
    },
    selectableValues () {
      let values = Object.assign({}, this.availableValues)
      const selectedOptions = Object.keys(this.selected)
      if (!selectedOptions.length) {
        return values
      }
      for (const selectedOption of selectedOptions) {
        const selectedValue = this.selected[selectedOption]
        const otherOptions = this.options.filter(option => option !== selectedOption)
        for (const otherOption of otherOptions) {
          values[otherOption] = values[otherOption].filter(value => {
            return this.variants.some(variant => variant.options.indexOf(value) !== -1 && variant.options.indexOf(selectedValue) !== -1)
          })
        }
      }
      return values
    },
    selectedColor () {
      const color = this.selectedVariant ? (this.selected.Color || this.selected.Colour) : ''
      return color
    },
    areAllOptionsSelected () {
      return Object.keys(this.selected).length === this.options.length
    },
    selectedVariant () {
      if (!this.areAllOptionsSelected) {
        return null
      }

      const matched = this.variants.filter(
        variant => {
          let matchedOptions = []
          for (let option in this.selected) {
            matchedOptions.push(variant.options.includes(this.selected[option]))
          }
          return matchedOptions.reduce((result, item) => result && item)
        }
      )

      return matched[0]
    },
    showClearFilter () {
      return Object.keys(this.selected).length >= 1
    }
  },
  watch: {
    selected: {
      deep: true,
      handler (newValue) {
        if (!this.selectedVariant) {
          this.$store.dispatch('variantSelector/changeSelectedValues', { values: null })
          this.$store.dispatch('variantSelector/changeFeaturedImageId', null)
          return
        }
        this.$store.dispatch('variantSelector/changeSelectedValues', { values: newValue })
        if (this.selectedVariant.featured_image && this.selectedVariant.featured_image.id) {
          this.$store.dispatch('variantSelector/changeFeaturedImageId', this.selectedVariant.featured_image.id)
        } else {
          this.$store.dispatch('variantSelector/changeFeaturedImageId', null)
        }
        const url = addQueryVar('variant', this.selectedVariant.id)
        history.pushState(null, null, url)
        this.$emit('select-variant', this.selectedVariant)
      }
    }
  },
  created () {
    uuid++
  },
  mounted () {
    if (this.initialSelectedVariant && this.initialSelectedVariant.id) {
      const value = this.options.reduce((result, option, index) => {
        result[option] = this.initialSelectedVariant.options[index]
        return result
      }, {})
      this.selected = value
    }
  },
  methods: {
    handlize,
    radioId (option, value) {
      return `product-${this.productId}-variant-selector-${uuid}-${handlize(option)}-${handlize(value)}`
    },
    getColorSwatchClasses (option, value) {
      let classes = ''
      if (option.toLowerCase() === 'color' || option.toLowerCase() === 'colour') {
        classes = `color-swatch color-swatch-${handlize(value)}`
      }
      return classes
    },
    getOptionValue (option, value) {
      return option === 'Nib' ? value.split(' ').map(w => w.length && w[0]).join('') : value
    },
    clearFilterVariant (value) {
      if (value) {
        const defaultHash = window.location.href.replace(/.([^?]*$)/, '')
        this.selected = {}
        history.pushState(null, null, defaultHash)
        this.$emit('select-variant', null)
      }
    }
  }
}
</script>
