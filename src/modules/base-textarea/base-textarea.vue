<template>
  <ValidationProvider
    v-slot="{ errors }"
    :name="label || $attrs.name"
    :rules="rules"
    :mode="mode"
    slim
  >
    <div class="form__block form__block--textarea">
      <div class="form__block-inner">
        <label
          v-if="label"
          :id="$attrs['aria-labelledby']"
          :for="$attrs.id"
          :class="['label label--textarea form__label', { 'label--error': errors[0] }]"
        >
          {{ label }}
          <span
            v-if="isRequired"
            class="form__required"
          >*
          </span>
        </label>
        <textarea
          v-model="privateValue"
          v-bind="$attrs"
          :type="type"
          :rows="rows"
          :class="['textarea form__textarea', { 'is-empty': isEmptyValue, 'has-value': !isEmptyValue, 'textarea--error': errors[0] }]"

          @input="$emit('input', $event.target.value)"
        />
        <span
          v-if="suffix"
          class="form__suffix"
        >
          {{ suffix }}
        </span>
      </div>
      <span
        v-if="errors[0]"
        class="form__message"
      >
        {{ errors[0] }}
      </span>
    </div>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  components: {
    ValidationProvider
  },
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: 'textarea'
    },
    rows: {
      type: String,
      default: '5'
    },
    value: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    rules: {
      type: [String, Array],
      default: ''
    },
    mode: {
      type: String,
      default: 'eager'
    }
  },
  data () {
    return {
      privateValue: this.value
    }
  },
  computed: {
    isEmptyValue () {
      return !this.privateValue.trim()
    },
    isRequired () {
      return this.rules.indexOf('required') !== -1
    }
  },
  watch: {
    value (newValue) {
      this.privateValue = newValue
    }
  }
}
</script>
