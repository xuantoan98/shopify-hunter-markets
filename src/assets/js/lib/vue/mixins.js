import { mapGetters, mapActions } from 'vuex'
import { select } from 'lib/dom'
import {
  disableBodyScroll,
  clearAllBodyScrollLocks
} from 'lib/bodyScrollLock'
import { off, onPassive } from '../dom'
import { debounce } from '../utils'

const MOBILE_BREAKPOINT = 768
const DESKTOP_BREAKPOINT = 1280

/* Global mixins */
const globalMixins = {
  data () {
    return {
      windowWidth: window.innerWidth
    }
  },
  computed: {
    isMobile () {
      return this.windowWidth < MOBILE_BREAKPOINT
    },
    isTablet () {
      return this.windowWidth >= MOBILE_BREAKPOINT && this.windowWidth < DESKTOP_BREAKPOINT
    }
  },
  methods: {
    resizeCallback () {
      this.windowWidth = window.innerWidth
    }
  },
  mounted () {
    this.debouncedResizeCallback = debounce(this.resizeCallback, 50)

    this.$nextTick(() => {
      onPassive('resize', this.debouncedResizeCallback, window)
    })
  },
  beforeDestroy () {
    off('resize', this.debouncedResizeCallback, window)
  }
}
/* End global mixins */

/* Local mixins */
const popupMixin = {
  props: {
    id: {
      type: String,
      default: '',
      required: true
    }
  },
  computed: {
    ...mapGetters('popupCollection', ['isActive']),
    isDisplayed () {
      return this.isActive(this.id)
    },
    groupType () {
      return 'popup'
    }
  },
  watch: {
    isDisplayed (newValue) {
      if (newValue) {
        this.$nextTick(() => {
          if (this.groupType !== 'notice' && this.scrollTarget !== '') {
            if (this.scrollTarget === 'null') {
              return
            }
            const target = select(this.scrollTarget, this.$el)
            disableBodyScroll(target)
          } else if (typeof this.$refs.inner !== 'undefined') {
            disableBodyScroll(this.$refs.inner)
          } else {
            disableBodyScroll()
          }
        })
      } else {
        clearAllBodyScrollLocks()
      }
    }
  },
  mounted () {
    this.register({ id: this.id, groupType: this.groupType })
  },
  methods: {
    ...mapActions('popupCollection', ['register', 'activate', 'deactivate']),
    hide () {
      this.deactivate(this.id)
      this.$emit('hide')
    },
    show () {
      this.activate(this.id)
      this.$emit('show')
    }
  }
}
/* End local mixins */

export {
  globalMixins,
  popupMixin
}
