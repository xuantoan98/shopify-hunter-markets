<template>
  <div
    :class="['product-images', className]"
  >
    <carousel
      v-if="finalImages.length"
      :key="carouselReRenderKey"
      ref="product-images-carousel"
      :has-nav="true"
      :class="['product-images__carousel carousel--product-images', { 'carousel--mobile': disableCarouselDesktop, 'carousel--vertical-nav': verticalNav, 'carousel--full-width': finalImages.length <= 1}]"
      :options="{ prevNextButtons: finalImages.length > 1, cellAlign: 'left', pageDots: true, watchCSS: false, wrapAround: true }"
    >
      <div
        v-for="(image, index) in finalImages"
        :key="image.id"
        class="carousel__item product-images__item"
        :data-image-id="image.id"
        :data-index="index"
      >
        <image-zoom
          v-if="enableImageZoom"
          class-name="product-images__image-zoom"
          image-class="product-images__image product-images__image--lead"
          :image="image.src"
          :image-alt="image.alt"
          :cover="true"
          @toggle-dragging-carousel="toggleDraggingCarousel($event)"
        />
        <image-lazy
          v-else
          class-name="product-images__image product-images__image--lead"
          :image-url="image.src"
          :alt="image.alt"
          :cover="true"
        />
      </div>
      <template
        v-if="useCarouselImageThumbnail && !disableCarouselDesktop"
        slot="nav"
        slot-scope="scope"
      >
        <div
          v-for="(image, index) in finalImages"
          :key="image.id"
          :data-index="index"
          class="carousel__nav-item"
          :class="{'carousel__nav-item--active': scope.currentIndex === index}"
          @click="scope.select(index)"
        >
          <image-lazy
            class="product-images__thumbnail-image"
            :cover="true"
            :image-url="image.src"
            :alt="image.alt"
          />
        </div>
      </template>
    </carousel>

    <modal
      id="modal-product-images"
      class-name="modal--product-images product-images__modal"
    >
      <template v-slot:content>
        <template>
          <carousel
            v-if="finalImages.length"
            :key="carouselReRenderKey"
            class="product-images__modal"
            :options="{'pageDots': false, 'wrapAround': true}"
          >
            <div
              v-for="(image, index) in finalImages"
              :key="index"
              class="product-images__item"
            >
              <image-zoom
                v-if="enableImageZoom"
                class-name="product-images__image-zoom"
                image-class="product-images__image product-images__image--lead"
                :image="image.src"
                :image-alt="image.alt"
                :cover="true"
                @toggle-dragging-carousel="toggleDraggingCarousel($event)"
              />
              <image-lazy
                v-else
                :image-url="image.src"
                image-class="product-images__image product-images__image--lead"
              />
            </div>
          </carousel>
        </template>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Flickity from 'flickity'

export default {
  props: {
    images: {
      type: [Array, String],
      default: ''
    },
    enableImageZoom: {
      type: Boolean,
      default: false
    },
    verticalNav: {
      type: Boolean,
      default: false
    },
    disableCarouselDesktop: {
      type: Boolean,
      default: false
    },
    useCarouselImageThumbnail: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isModalDisplayed: false,
      carouselReRenderKey: 0,
      carouselModalReRenderKey: 0,
      modalId: 'modal-product-images',
      currentIndex: 0
    }
  },
  computed: {
    ...mapState('variantSelector', ['featuredImageId', 'selectedValues']),
    finalImages () {
      return this.selectedValues && Object.keys(this.selectedValues).length
        ? this.filterFinalImages()
        : this.images
    }
  },
  watch: {
    finalImages: {
      deep: true,
      handler () {
        this.carouselReRenderKey++
      }
    }
  },
  methods: {
    toggleModal () {
      this.isModalDisplayed = !this.isModalDisplayed
    },
    toggleDraggingCarousel (value) {
      const carousel = Flickity.data(this.$refs['product-images-carousel'].$refs.carousel)
      carousel.options.draggable = !value
      carousel.updateDraggable()
    },
    filterFinalImages () {
      const filteredImages = this.images.filter(image => {
        // Get text only in image alt (remove all other special characters, including spaces)
        const mappedVariants = image.alt
          .toLowerCase()
          .split(',')
          .map(string => string.trim())

        // Break all values into a single array of texts, which used to map with alt
        const valueStrings = Object.keys(this.selectedValues).map(key => this.selectedValues[key].toLowerCase())

        // Check matched alt: True only when every string in valueStrings matched with the string in mappedVariants
        const matchedAlt = mappedVariants.some(variant => {
          return variant
            .split('|')
            .map(string => string.trim())
            .every(string => valueStrings.indexOf(string) !== -1)
        })

        // Exclude variant's featured image
        const isFeaturedImage = this.featuredImageId && image.id === this.featuredImageId

        return matchedAlt && !isFeaturedImage
      })
      if (this.featuredImageId) {
        const featuredImage = this.images.find(image => image.id === this.featuredImageId)
        if (featuredImage) {
          filteredImages.unshift(featuredImage)
        }
        return filteredImages
      }
      return this.images
    },
    updateCarousel (index) {
      this.currentIndex = index
    }
  }
}
</script>
