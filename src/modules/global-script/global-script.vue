<template>
  <div>
    <slot />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { addClass, on } from 'lib/dom'
import { scrollRevealing } from 'lib/scrollRevealing'
import { dragScroll } from 'lib/dragScroll'

const NEWSLETTER_ERROR_MESSAGE = 'Your email address is already exists'
const HIDE_LOGIN_SUCCESS_NOTICE_KEY = 'hideLoginSuccessNotice'
const GLOBAL_NOTICE_DURATION = 10000

export default {
  computed: {
    ...mapState(['customer'])
  },
  mounted () {
    this.$nextTick(() => {
      this.handleAccountNotice()
      this.handleNewsletterNotice()
      scrollRevealing()
      dragScroll()
      this.handlePageLoad()
    })
  },
  methods: {
    handlePageLoad () {
      on('load', () => {
        addClass('is-loaded', document.body)
      }, window)
    },
    handleNewsletterNotice () {
      if (window.location.href.match(/[?&]contact%5Btags%5D=&form_type=customer/)) {
        this.$store.dispatch('noticeTrigger/changeMessage', { message: NEWSLETTER_ERROR_MESSAGE })
        this.$store.dispatch('noticeTrigger/changeType', { type: 'error' })
        this.$store.dispatch('noticeTrigger/changeDuration', { duration: GLOBAL_NOTICE_DURATION })
      }
    },
    handleAccountNotice () {
      if (this.customer) {
        if (!this.getLocalStorage(HIDE_LOGIN_SUCCESS_NOTICE_KEY)) {
          const message = `<p>Welcome back ${this.customer.name}! <a href="/account">View account</a></p>`
          this.$store.dispatch('noticeTrigger/changeMessage', { message })
          this.$store.dispatch('noticeTrigger/changeType', { type: 'success' })
          this.$store.dispatch('noticeTrigger/changeDuration', { duration: GLOBAL_NOTICE_DURATION })
          setTimeout(() => {
            this.setLocalStorage(HIDE_LOGIN_SUCCESS_NOTICE_KEY, true)
          }, GLOBAL_NOTICE_DURATION)
        }
      } else {
        this.removeLocalStorage(HIDE_LOGIN_SUCCESS_NOTICE_KEY)
      }
    },
    removeLocalStorage (key) {
      return localStorage.removeItem(key)
    },
    getLocalStorage (key) {
      return localStorage.getItem(key)
    },
    setLocalStorage (key, value) {
      return localStorage.setItem(key, value)
    }
  }
}
</script>
