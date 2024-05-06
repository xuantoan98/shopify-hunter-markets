import store from 'lib/store'

export default () => {
  store.registerModule('variantSelector', {
    namespaced: true,
    state: {
      featuredImageId: null,
      selectedValues: null
    },
    mutations: {
      mutateFeaturedImageId (state, id) {
        state.featuredImageId = id
      },
      mutateSelectedValues (state, values) {
        state.selectedValues = values
      }
    },
    actions: {
      changeFeaturedImageId ({ commit }, id) {
        commit('mutateFeaturedImageId', id)
      },
      changeSelectedValues ({ commit }, { values }) {
        commit('mutateSelectedValues', values)
      }
    }
  })
}
