<template>
  <figure
    :class="['image-lazy', className, { 'image-lazy--cover': cover, 'image-lazy--contain': contain }]"
  >
    <img
      ref="image"
      data-sizes="auto"
      :src="BLANK_GIF"
      :class="['image-lazy__img', 'lazyload', imageClass]"
      :alt="alt"
      :data-normal="imageSrc"
      :data-retina="imageSrc"
      :data-srcset="srcset"
      :data-src="imageUrl"
      :sizes="sizes"
    >
    <slot name="content" />
  </figure>
</template>

<script>
import { mapState } from 'vuex'
import 'lazysizes'
import 'lazysizes/plugins/parent-fit/ls.parent-fit'
import 'lazysizes/plugins/respimg/ls.respimg'

if (!('object-fit' in document.createElement('a').style)) {
  require('lazysizes/plugins/object-fit/ls.object-fit')
}

export default {
  props: {
    imageUrl: {
      type: String,
      default: ''
    },
    imageClass: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    sizes: {
      type: String,
      default: ''
    },
    isSrcSet: {
      type: Boolean,
      default: true
    },
    cover: Boolean,
    contain: Boolean
  },
  computed: {
    ...mapState(['defaultImage']),
    srcset () {
      if (this.isSrcSet && this.imageSrc) {
        const widths = [150, 320, 768, 1440, 2880, 3200]
        return widths.map(width => `${this.getUrlForWidth(width)} ${width}w`).join(', ')
      } else {
        return ''
      }
    },
    imageSrc () {
      return this.imageUrl ? ((this.imageUrl === '' || this.imageUrl.includes('no-image') ? this.defaultImage : this.imageUrl)) : this.defaultImage
    }
  },
  created () {
    this.BLANK_GIF = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUCB1j+Pjx438ACX0D04PrXz0AAAAASUVORK5CYII='
  },
  methods: {
    getUrlForWidth (width) {
      if (this.imageSrc) {
        const parts = this.imageSrc.split('.')
        return [parts.slice(0, -1).join('.') + `_${width}x`, parts.slice(-1)].join('.')
      }
    }
  }
}
</script>
