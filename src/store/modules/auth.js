import authApi from "../../api/auth"

export default {
  state: {
    status: 'not success',
    token: localStorage.getItem('token') || '',
    isLogin: !!(localStorage.getItem('token') || null)
  },
  //getters: {},
  mutations: {
    auth_request(state) {
      state.status = 'loading';
    },
    auth_success(state, payload) {
      state.isLogin = true;
      state.status = 'success';
      state.token = payload.token;
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.isLogin = false;
      state.status = 'unauthorized'
      state.token = ''
      localStorage.removeItem('token')
    },
  },
  actions: {
    login({commit}, data) {
      commit('auth_request')
      authApi.login(data)
        .then(resp => {
          const token = resp.access
          localStorage.setItem('token', token)
          commit('auth_success', {token})
        })
        .catch(error => {
          console.log(error)
          commit('auth_error')
          localStorage.removeItem('token')
        })
    },
    register({commit}, data) {
      authApi.register(data)
        .then(resp => resp.data)
        .then(data => {
          const token = data.access
          localStorage.setItem('token', token)
          commit('auth_success', {token})
        })
        .catch(error => {
          console.log(error)
          commit('auth_error')
        })
    }
  }
}