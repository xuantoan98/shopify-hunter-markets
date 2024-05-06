<template>
  <div :class="['card', className]">
    <div class="card__inner">
      <div
        ref="image"
        class="card__image-wrapper"
      >
        <a
          v-if="ctaPrimaryUrl"
          class="card__image-link"
          :href="ctaPrimaryUrl"
        >
          <image-lazy
            v-if="!isMobile && secondImage"
            :cover="true"
            class="card__image card__image--second"
            :image-url="secondImage"
            :is-src-set="isSrcSet"
          />
          <image-lazy
            :cover="true"
            class="card__image"
            :image-url="featuredImage"
            :is-src-set="isSrcSet"
          />
        </a>
        <image-lazy
          v-else
          :cover="true"
          class="card__image"
          :image-url="featuredImage"
          :is-src-set="isSrcSet"
        />
      </div>
      <slot name="before-content" />
      <div class="card__content">
        <div class="card__content-inner">
          <slot name="label" />
          <h3
            v-if="title"
            :class="['card__title', titleClass]"
          >
            <a
              v-if="ctaPrimaryUrl"
              class="card__title-link"
              :href="ctaPrimaryUrl"
            >
              {{ title }}
            </a>
            <template v-else>
              {{ title }}
            </template>
          </h3>
          <slot name="description" />
        </div>
        <slot name="ctas" />
      </div>
      <slot name="after-content" />
    </div>
  </div>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    titleClass: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    ctaPrimaryUrl: {
      type: String,
      default: ''
    },
    featuredImage: {
      type: String,
      default: ''
    },
    secondImage: {
      type: String,
      default: ''
    },
    isSrcSet: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    getImageEl () {
      return this.$refs.image
    }
  }
}
</script>
