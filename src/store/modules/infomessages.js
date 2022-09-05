export default {
  state: {
    message: null
  },
  mutations: {
    ADD_MESSAGE(state, data) {
      state.message = data
    },
    REMOVE_MESSAGE(state) {
      state.message = null
    }
  }
}