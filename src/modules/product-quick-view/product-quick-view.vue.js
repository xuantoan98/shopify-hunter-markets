import Component from 'lib/component'
import { mapState } from 'vuex'

class ProductQuickView extends Component {
  register () {
    return {
      props: {
        initialModalDisplayed: {
          type: Boolean,
          default: false
        },
        product: Object,
        currentVariant: Object,
        variantsType: String,
        productUrl: String,
        productImages: Array
      },
      data () {
        return {
          isModalDisplayed: this.initialModalDisplayed
        }
      },
      computed: {
        ...mapState('cartTrigger', ['isDropdownDisplayed'])
      },
      watch: {
        isDropdownDisplayed (newValue) {
          if (newValue) {
            this.isModalDisplayed = false
          }
        }
      }
    }
  }

  store () {
    return {
      state: {
        featuredImageId: null
      },
      mutations: {
        mutateFeaturedImageId (state, id) {
          state.featuredImageId = id
        }
      },
      actions: {
        setFeaturedImageId ({ commit }, id) {
          commit('mutateFeaturedImageId', id)
        }
      }
    }
  }
}

export default ProductQuickView
