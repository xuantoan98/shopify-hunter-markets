<template>
  <section
    class="carousel"
    :class="className"
    v-bind="$attrs"
  >
    <div
      ref="carousel"
      class="carousel__content"
    >
      <slot />
    </div>
    <div
      v-if="hasNav"
      ref="nav"
      class="carousel__nav"
    >
      <slot
        name="nav"
        :select="select"
        :current-index="currentIndex"
      />
    </div>
    <div
      v-if="hasScrollbar"
      ref="scrollbarTrack"
      class="carousel__scrollbar-track"
    >
      <div
        ref="scrollbar"
        class="carousel__scrollbar"
      />
    </div>
    <div
      v-if="hasNavNumber"
      ref="navNumber"
      class="carousel__nav-number"
    >
      {{ handleNavNumber }}
    </div>
  </section>
</template>

<script>
import Flickity from 'flickity'
import { on, select, selectAll, getHeight, setStyle, getData, scrollTop, getTopPosition } from 'lib/dom'
import { map } from 'lib/utils'
import throttle from 'lodash.throttle'

const BUTTONS_SELECTOR = '.flickity-prev-next-button'

export default {
  inheritAttrs: false,
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    hasNav: Boolean,
    className: {
      type: String,
      default: ''
    },
    hasScrollbar: Boolean,
    hasNavNumber: Boolean
  },
  data () {
    return {
      defaultOptions: {
        arrowShape: 'M74.9 99l1.57-1.57a2.68 2.68 0 000-3.8L32.83 50 76.47 6.36a2.68 2.68 0 000-3.79L74.89 1a2.68 2.68 0 00-3.79 0L24 48.1a2.68 2.68 0 000 3.8L71.1 99a2.68 2.68 0 003.8 0z',
        watchCSS: true,
        prevNextButtons: false,
        pageDots: true,
        cellAlign: 'center',
        percentPosition: false,
        resizeHeight: false,
        buttonAlign: false,
        groupCells: true
      },
      instance: null,
      currentIndex: 0
    }
  },
  computed: {
    finalOptions () {
      return Object.assign({}, this.defaultOptions, this.prevNextButtons, this.options)
    },
    prevNextButtons () {
      return {
        prevNextButtons: this.$slots.default.length > this.options.groupCellsNumber || false
      }
    },
    handleNavNumber () {
      if (this.instance) {
        const getLengthCells = this.instance.cells.length
        const getCurrentIndex = this.currentIndex + 1
        return getCurrentIndex + ' / ' + getLengthCells
      } else {
        return ''
      }
    }
  },
  mounted () {
    this.init()
    let windowWidth = window.innerWidth
    on('resize', throttle(() => {
      if (window.innerWidth !== windowWidth) {
        this.init()
        windowWidth = window.innerWidth
      }
    }, 100), window)
  },
  beforeDestroy () {
    this.destroy()
  },
  methods: {
    init () {
      this.instance = new Flickity(this.$refs.carousel, this.finalOptions)
      this.$emit('carousel-init', this)
      if (this.options.initialIndex) {
        this.selectCell(this.options.initialIndex)
      }
      this.initEvents()
      if (this.hasScrollbar) {
        this.handleScrollbar()
      }
      this.repositionButtons()
    },
    update () {
      if (this.instance) {
        this.instance.resize()
      }
    },
    selectCell (index, isInstant = true) {
      const isWrap = false
      if (this.instance) {
        this.instance.selectCell(index, isWrap, isInstant)
      }
    },
    select (index, isInstance = true) {
      const isWrap = false
      if (this.instance) {
        this.instance.select(index, isWrap, isInstance)
      }
    },
    observeMutations () {
      // Observe DOM change to re-calculate slider
      const callback = (mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            this.destroy()
            this.init()
            this.update()
          }
        })
      }
      const observer = new MutationObserver(callback)
      observer.observe(this.$el, { childList: true, subtree: true, attributes: true })
    },
    repositionButtons () {
      if (!this.finalOptions.buttonAlign) {
        return
      }

      const buttons = selectAll(BUTTONS_SELECTOR, this.$el)
      if (!buttons.length) {
        return
      }

      for (let vnode of this.$slots.default) {
        // Get reference to child Vue component
        const ref = (vnode.data && vnode.data.ref) || ''
        if (ref) {
          // Get child Vue component
          const component = vnode.context.$refs[ref][0] || vnode.context.$refs[ref]
          // Get image element from child component
          const imageEl = component.getImageEl()
          if (imageEl) {
            const buttonPosition = getHeight(imageEl) / 2
            map(button => setStyle('top', `${buttonPosition}px`, button), buttons)
          }
          break
        }
      }
    },
    scrollToNav () {
      if (this.hasNav) {
        const navEl = this.$refs.nav
        const navItem = selectAll('[data-index]', navEl).find(el => parseInt(getData('index', el)) === this.currentIndex)
        const offset = getTopPosition(navItem) - getTopPosition(navEl)
        scrollTop(offset, undefined, navEl)
      }
    },
    destroy () {
      if (this.instance) {
        this.instance.destroy()
      }
    },
    getCurrentIndex () {
      return this.currentIndex
    },
    handleScrollbar () {
      if (this.instance) {
        const slider = select('.flickity-slider', this.$el)
        if (!slider) {
          return
        }
        const scrollbarPercentage = slider.clientWidth / slider.scrollWidth * 100
        setStyle('width', `${scrollbarPercentage}%`, this.$refs.scrollbar)
        this.instance.on('scroll', (progress) => {
          const percentage = Math.min(Math.max(progress * 100, 0), 100)
          setStyle('left', `${percentage * (100 - scrollbarPercentage) / 100}%`, this.$refs.scrollbar)
        })
      }
    },
    initEvents () {
      this.instance.on('change', (index) => {
        setTimeout(() => {
          this.currentIndex = index
          this.scrollToNav()
          this.$emit('carousel-change', index)
        })
      })
      this.instance.on('staticClick', (e, pointer, cellEl, cellIndex) => {
        this.$emit('carousel-static-click', e, pointer, cellEl, cellIndex)
      })
    }
  }
}
</script>
