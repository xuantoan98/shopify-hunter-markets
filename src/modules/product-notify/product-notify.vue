<template>
  <div class="product-notify">
    <div class="product-notify__container">
      <h2 class="product-notify-title product-notify__title">
        {{ title }}
      </h2>
      <div class="product-notify__content">
        <slot />
        <form-vue
          v-cloak
          v-slot="scopeProductNotify"
          class="form--product-notify"
          name="product-notify"
          :validation="true"
        >
          <base-input
            v-model="email"
            label="Enter email address"
            type="email"
            name="email"
            rules="required"
          />
          <button
            class="button button--secondary product-notify__button"
            type="submit"
            @click.prevent="scopeProductNotify.handleSubmit(submit)"
          >
            {{ buttonTitle }}
          </button>
        </form-vue>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    variantId: {
      type: Number,
      default: 0
    },
    productId: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: Object,
      default: () => ({})
    },
    buttonTitle: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      email: '',
      message: ''
    }
  },
  methods: {
    submit () {
      this.message = 'We will contact you when this product becomes available'
      this.$store.dispatch('floatingNotification/activate', { message: this.message, type: 'success' })
    }
  }
}
</script>
