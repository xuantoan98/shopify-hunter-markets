<template>
  <div :class="['quantity', className]">
    <label
      v-if="label"
      :for="id"
      class="quantity__label"
    >{{ label }}</label>
    <div class="quantity__control">
      <button
        type="button"
        :disabled="disabled || currentQty <= min"
        class="quantity__button"
        @click="changeValue(currentQty - 1, ['input', 'change'])"
      >
        <span class="icon-minus" />
      </button>
      <input
        :id="id"
        :value="currentQty"
        :disabled="disabled || max < 1"
        autocomplete="off"
        class="quantity__input input-quantity"
        type="number"
        :max="max"
        :placeholder="currentQty"
        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
        @input="changeValue($event.target.value)"
      >
      <button
        type="button"
        :disabled="disabled || (max && currentQty >= max)"
        class="quantity__button"
        @click="changeValue(currentQty + 1, ['input', 'change'])"
      >
        <span class="icon-plus" />
      </button>
    </div>
    <div
      v-if="message"
      class="quantity__message"
    >
      {{ message }}
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

let uuid = 0
export default {
  props: {
    className: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: Number.MAX_VALUE
    },
    label: {
      type: String,
      default: ''
    },
    defaultValue: {
      type: Number,
      default: 1
    }
  },
  data () {
    uuid++
    return {
      currentQty: this.value
    }
  },
  computed: {
    id () {
      return `quantity-${uuid}`
    },
    message () {
      if (this.value > this.max) {
        return `We only have ${this.max} of this item in stock`
      }

      if (this.value === 0) {
        return 'Value must be greater than or equal to 1'
      }

      return null
    }
  },
  watch: {
    value (newValue) {
      this.currentQty = newValue
    }
  },
  methods: {
    changeValue (newValue, events = ['input']) {
      newValue = parseInt(newValue) || this.defaultValue
      if (this.max && newValue > this.max) {
        newValue = this.max
      }
      this.currentQty = newValue
      this.emit(events, newValue)
    },
    emit: debounce(function (events, value) {
      events.forEach(name => this.$emit(name, value))
    }, 300, { trailing: true })
  }
}
</script>
