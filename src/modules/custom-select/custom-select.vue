<template>
  <div :class="['custom-select', className]">
    <span
      v-if="(isMobile || isTablet) && !isEnableLabelMobile"
      class="custom-select__icon custom-select__icon--mobile"
    >
      <svg viewBox="0 0 448 512">
        <use
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#icon-arrow-down"
          x="0"
          y="0"
        />
      </svg>
    </span>
    <div
      v-if="(isMobile || isTablet) && isEnableLabelMobile"
      class="custom-select__label"
    >
      <span class="custom-select__label-text">
        {{ selectedName }}
      </span>
      <span class="custom-select__label-icon">
        <svg viewBox="0 0 448 512">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#icon-arrow-down"
            x="0"
            y="0"
          />
        </svg>
      </span>
    </div>
    <select
      :id="uuid"
      ref="select"
      class="custom-select__mobile custom-select__el"
      v-bind="$attrs"
      @value="selectedName"
      @change="emitChange"
    >
      <option
        v-for="option in options"
        :key="option.id"
        :value="option.value"
        :disabled="option.value === valueDisable || option.disabled"
        :selected="option.value === selectedValue"
      >
        {{ option.name }}
      </option>
    </select>
    <div
      v-if="!isMobile"
      v-click-outside="hideDropdown"
      class="custom-select__desktop"
      v-bind="$attrs"
      @click="showDropdown"
    >
      <div :class="['custom-select__current', {'active': isActive}]">
        {{ selectedName }}
        <span class="custom-select__icon">
          <svg viewBox="0 0 448 512">
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="#icon-arrow-down"
              x="0"
              y="0"
            />
          </svg>
        </span>
      </div>
      <label
        v-if="label"
        :class="['label label--select', {'active': isActive}]"
      >
        {{ label }}
      </label>
      <div
        v-show="isActive"
        class="custom-select__dropdown"
      >
        <div
          v-for="option in options"
          :key="option.id"
          :data-value="option.value"
          :class="['custom-select__option', { 'ticked' :selectedValue === option.value, 'custom-select__option--disable': option.value === valueDisable || option.disabled }]"
          @click="selectedOption(option)"
        >
          {{ option.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getClickOutsideInstance } from 'lib/vue/directives'

let uuid = 0

export default {
  directives: {
    'click-outside': getClickOutsideInstance()
  },
  inheritAttrs: false,
  props: {
    className: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    valueDisable: {
      type: String,
      default: ''
    },
    isEnableLabelMobile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    uuid++

    return {
      uuid: this.id || uuid,
      isActive: false,
      selectedValue: this.value || this.options[0].value,
      tag: this.options[0].tag
    }
  },
  computed: {
    selectedName () {
      if (this.selectedValue || this.selectedValue === 0) {
        const selectedOption = this.options.find(option => option.value === this.selectedValue)
        return selectedOption ? selectedOption.name : ''
      }
      return ''
    }
  },
  methods: {
    selectedOption (option) {
      this.selectedValue = option.value
      this.tag = option.tag
      this.$emit('change', this.selectedValue)
    },
    showDropdown () {
      this.isActive = !this.isActive
    },
    hideDropdown () {
      this.isActive = false
    },
    emitChange ($event) {
      this.$emit('change', $event.target.value)
      this.selectedValue = $event.target.value
    }
  }
}
</script>
