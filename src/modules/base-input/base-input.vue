<template>
  <ValidationProvider
    v-slot="{ errors }"
    :name="label || $attrs.name"
    :rules="rules"
    :mode="mode"
    slim
    :vid="vid"
  >
    <div :class="['form__block', { 'form__block--suffix': !!suffix, 'form__block--error': errors[0] }, className]">
      <div class="form__block-inner">
        <label
          v-if="label && !hideLabel"
          :id="$attrs['aria-labelledby']"
          :for="$attrs.id"
          :class="['label label--input form__label', { 'label--error': errors[0] }]"
        >
          {{ label }}
          <span
            v-if="isRequired"
            class="form__required"
          >*
          </span>
        </label>
        <input
          v-model="inputValue"
          v-bind="$attrs"
          :class="['input form__input', { 'is-empty': isEmptyValue, 'has-value': !isEmptyValue, 'input--error': errors[0] }]"
          :type="privateType"
          @input="$emit('input', $event.target.value)"
        >
        <span
          v-if="suffix"
          class="form__suffix"
        >{{ suffix }}</span>
        <div
          v-if="type == 'password' && showPass"
          class="form__icon"
        >
          <button
            :class="['form__password-icon', {'form__password-icon--active':isActive}]"
            @click.prevent="showPassword"
          />
        </div>
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
    className: {
      type: String,
      default: ''
    },
    vid: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
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
    },
    showPass: {
      type: Boolean,
      default: false
    },
    hideLabel: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      privateType: this.type,
      isActive: false,
      inputValue: this.value
    }
  },
  computed: {
    isEmptyValue () {
      return !this.inputValue.trim()
    },
    isRequired () {
      return this.rules.indexOf('required') !== -1
    }
  },
  methods: {
    showPassword () {
      this.isActive = !this.isActive
      this.privateType = this.privateType === 'password' ? 'text' : 'password'
    }
  }
}
</script>
