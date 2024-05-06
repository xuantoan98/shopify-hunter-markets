import store from 'lib/store'

export default () => {
  store.registerModule('cartTrigger', {
    namespaced: true,
    state: {
      isDropdownDisplayed: false,
      timeout: null
    },
    mutations: {
      mutateDropdownDisplay (state, value) {
        state.isDropdownDisplayed = value
      },
      mutateTimeout (state, value) {
        state.timeout = value
      }
    },
    actions: {
      clearDropdownTimeout ({ state, commit }) {
        if (state.timeout) {
          clearTimeout(state.timeout)
        }
        commit('mutateTimeout', null)
      },
      openCartDropdown ({ state, commit, dispatch }, payload = { autoClose: false }) {
        commit('mutateDropdownDisplay', true)
      },
      hideCartDropdown ({ commit }) {
        commit('mutateDropdownDisplay', false)
      },
      toggleCartDropdown ({ state, dispatch }) {
        if (state.isDropdownDisplayed) {
          dispatch('hideCartDropdown')
        } else {
          dispatch('openCartDropdown')
        }
      }
    }
  })
}
