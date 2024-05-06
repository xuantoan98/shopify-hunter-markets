<script>
import { addQueryVar } from 'lib/utils'

export default {
  props: {
    isVue: {
      type: Boolean,
      default: true
    },
    startPage: {
      type: Number,
      default: 1
    },
    pageRange: {
      type: Number,
      default: 1
    },
    currentPage: {
      type: Number,
      default: 1
    },
    totalPages: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      isMounted: false
    }
  },
  computed: {
    pages () {
      const pages = []

      let pageNumber = this.startPage

      do {
        const page = {
          number: pageNumber,
          isSelected: pageNumber === this.currentPage
        }

        pages.push(page)

        pageNumber++

        if (pageNumber < this.currentPage - this.pageRange) {
          pages.push({ isSeparator: true })
          pageNumber = this.currentPage - this.pageRange
        } else if (pageNumber > this.currentPage + this.pageRange && pageNumber < this.totalPages) {
          pages.push({ isSeparator: true })
          pageNumber = this.totalPages
        }
      } while (pageNumber <= this.totalPages)

      return pages
    },
    mutableCurrentPage: {
      get () {
        return this.currentPage
      },
      set (newValue) {
        this.currentPage = newValue
      }
    }
  },
  mounted () {
    if (this.isVue) {
      this.isMounted = true
    }
  },
  methods: {
    getPaginatedUrl (number) {
      return addQueryVar('page', number)
    },
    navigate (number) {
      this.mutableCurrentPage = number
      this.$emit('navigate', number)
    }
  }
}
</script>
