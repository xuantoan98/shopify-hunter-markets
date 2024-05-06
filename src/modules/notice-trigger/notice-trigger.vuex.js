import store from 'lib/store'

export default () => {
  store.registerModule('noticeTrigger', {
    namespaced: true,
    state: {
      message: '',
      type: 'default',
      duration: 3000
    },
    actions: {
      changeMessage ({ commit }, { message }) {
        commit('mutateMessage', message)
      },
      changeType ({ commit }, { type }) {
        commit('mutateType', type)
      },
      changeDuration ({ commit }, { duration }) {
        commit('mutateDuration', duration)
      }
    },
    mutations: {
      mutateMessage (state, message) {
        state.message = message
      },
      mutateType (state, type) {
        state.type = type
      },
      mutateDuration (state, duration) {
        state.duration = duration
      }
    }
  })
}
