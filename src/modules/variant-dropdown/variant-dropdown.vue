<template>
  <div class="variant-dropdown">
    <div
      v-click-outside="hideDropdown"
      class="variant-dropdown__inner"
    >
      <div
        class="variant-dropdown__toggle"
        @click="showDropdown"
      >
        <div class="variant-dropdown__title">
          <div
            v-if="selectedVariant"
            class="variant-dropdown__title-inner"
          >
            {{ selectedVariant.title }}
          </div>
          <div
            v-else
            class="variant-dropdown__title-inner"
          >
            Please select variant
          </div>
        </div>
        <div class="variant-dropdown__icon">
          <svg viewBox="0 0 448 512">
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="#icon-arrow-down"
              x="0"
              y="0"
            />
          </svg>
        </div>
      </div>
      <div
        v-if="isOpen"
        class="variant-dropdown__list"
      >
        <div
          v-for="(item, index) in variants"
          :key="index"
          :class="['variant-dropdown__item', {'variant-dropdown__item--disabled': !isAvailable(item)}]"
          @click="selected(item)"
        >
          <div class="variant-dropdown__item-title">
            <span>{{ item.title }}</span>
            <span v-if="!isAvailable(item)">
              Out of stock
            </span>
            <span v-if="isAvailable(item) && item['inventory_quantity'] === 1">
              Only
            </span>
          </div>
          <div
            v-if="selectedVariant && item.id === selectedVariant.id"
            class="variant-dropdown__item-icon"
          >
            <svg
              viewBox="0 0 18 18"
            >
              <use
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xlink:href="#icon-success"
                x="0"
                y="0"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getClickOutsideInstance } from 'lib/vue/directives'
import { addQueryVar } from 'lib/utils'

export default {
  directives: {
    'click-outside': getClickOutsideInstance()
  },
  props: {
    showSizeGuide: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    },
    variants: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isOpen: false,
      selectedVariant: null
    }
  },
  watch: {
    selectedVariant: {
      deep: true,
      handler (newValue) {
        this.$store.dispatch('variantSelector/changeSelectedValues', { values: this.selectedVariant.id })
        if (!this.selectedVariant) {
          return
        }
        const url = addQueryVar('variant', this.selectedVariant.id)
        history.pushState(null, null, url)
        this.$emit('select-variant', this.selectedVariant)
      }
    }
  },
  methods: {
    showDropdown () {
      this.isOpen = !this.isOpen
    },
    hideDropdown () {
      this.isOpen = false
    },
    selected (item) {
      this.selectedVariant = item
      this.isOpen = false
    },
    isAvailable (item) {
      return item.available && item['inventory_quantity'] > 0
    }
  }
}
</script>
