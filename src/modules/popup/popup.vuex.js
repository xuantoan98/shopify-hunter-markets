import store from 'lib/store'
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

const PopupStore = () => {
  store.registerModule('popupCollection', {
    namespaced: true,
    state: {
      popups: []
    },
    getters: {
      index (state) {
        return (id) => {
          return state.popups.findIndex(d => d.id === id)
        }
      },
      isActive (state, getters) {
        return (id) => {
          const index = getters.index(id)
          return index !== -1 && state.popups[index].active
        }
      }
    },
    actions: {
      activate ({ commit, getters, state }, id) {
        const index = getters.index(id)
        if (index !== -1) {
          const location = {
            ...history.location,
            hash: state.popups[index].id
          }
          history.push(location)
          commit('mutationActivate', index)
        }
      },
      deactivate ({ commit, getters, state }, id) {
        const index = getters.index(id)
        const location = {
          ...history.location,
          hash: ''
        }
        history.push(location)
        if (index !== -1) {
          commit('mutationDeactivate', index)
        }
      },
      /**
       * Register a popup
       * @param commit
       * @param state
       * @param id
       */
      register ({ commit, state }, { id }) {
        const popup = state.popups.find(d => d.id === id)
        if (!popup) {
          commit('mutationRegister', id)
        }
      }
    },
    mutations: {
      mutationRegister (state, id) {
        state.popups.push({
          id,
          active: false
        })
      },
      mutationActivate (state, index) {
        state.popups[index].active = true
      },
      mutationDeactivate (state, index) {
        state.popups[index].active = false
      }
    }
  })
}

export default PopupStore
