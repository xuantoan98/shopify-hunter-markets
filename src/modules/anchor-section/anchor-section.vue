<template>
  <div
    v-if="itemsData.length"
    class="anchor-section"
    :class="[className, { 'anchor-section--sticky': isSticky }]"
  >
    <carousel
      ref="carousel"
      :class="carouselClass"
      :options="{ watchCSS: false, pageDots: false, freeScroll: true, contain: true }"
      @carousel-static-click="scrollToSection"
    >
      <div
        v-for="item in itemsData"
        :key="item.id"
        class="carousel__item"
        :class="{ 'carousel__item--active': item.active }"
        :data-anchor-id="item.id"
      >
        {{ item.title }}
      </div>
    </carousel>
  </div>
</template>

<script>
import {
  getData,
  closest,
  selectAll,
  select,
  getHeight,
  getTopOffset,
  scrollTop,
  handleize,
  on
} from 'lib/dom'
import { debounce } from 'lib/utils'

const ANCHOR_ID_ATTR = 'anchor-id'
const HEADER_SELECTOR = '.js-header'
const TOPBAR_SELECTOR = '.js-main-topbar'

export default {
  props: {
    className: {
      type: String,
      default: ''
    },
    carouselClass: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: () => []
    },
    itemPrefix: {
      type: String,
      default: 'anchor-section'
    },
    isSticky: Boolean
  },
  data () {
    return {
      currentIndex: 0,
      itemsData: []
    }
  },
  watch: {
    currentIndex (newValue, oldValue) {
      const carouselComponent = this.$refs.carousel
      if (newValue !== oldValue && carouselComponent) {
        carouselComponent.selectCell(newValue, false)
      }
    }
  },
  mounted () {
    if (this.items.length) {
      this.assignData()
      this.handleScroll()
    }
  },
  methods: {
    assignData () {
      this.itemsData = this.items.map((item, index) => ({
        id: this.getItemId(item),
        title: item,
        active: false
      }))
    },
    scrollToSection (e) {
      const anchorEl = closest(`[data-${ANCHOR_ID_ATTR}]`, e.target) || e.target
      const anchorId = getData(ANCHOR_ID_ATTR, anchorEl)
      if (!anchorId) {
        return
      }
      const destinationEl = selectAll(`#${anchorId}`)[0]
      if (destinationEl) {
        const offset = getTopOffset(destinationEl) - this.getStickyHeight()
        scrollTop(offset)
      }
    },
    getStickyHeight () {
      let stickyHeight = 0
      const headerEl = select(HEADER_SELECTOR)
      const topbarEl = select(TOPBAR_SELECTOR)
      stickyHeight += headerEl ? getHeight(headerEl) : 0
      stickyHeight += topbarEl ? getHeight(topbarEl) : 0
      stickyHeight += this.isSticky ? getHeight(this.$el) : 0
      return stickyHeight
    },
    getItemId (item) {
      const id = handleize(item)
      return this.itemPrefix ? `${this.itemPrefix}-${id}` : id
    },
    handleScroll () {
      on('scroll', debounce(() => {
        const topScroll = window.scrollY + this.getStickyHeight() + 1
        for (let i = 0; i < this.itemsData.length; i++) {
          const item = this.itemsData[i]
          const itemEl = selectAll(`#${item.id}`)[0]
          const topOffset = getTopOffset(itemEl)
          const bottomOffset = topOffset + itemEl.getBoundingClientRect().height
          item.active = topScroll >= topOffset && topScroll <= bottomOffset
          if (item.active) {
            this.currentIndex = i
          }
        }
      }, 100), window)
    }
  }
}
</script>
