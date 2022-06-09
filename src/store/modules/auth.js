import authApi from "../../api/auth"

export default {
  state: {
    status: 'not success',
    token: localStorage.getItem('token') || '',
    isLogin: false
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
    },
    auth_success(state) {
      state.isLogin = true;
      state.status = 'success';
    },
    auth_error(state) {
      state.status = 'error'
      state.isLogin = true;
    },
    logout(state) {
      state.isLogin = false;
      state.status = 'unauthorized'
      state.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('refresh')
    },
  },
  actions: {
    login({commit}, data) {
      commit('auth_request')
      authApi.login(data)
        .then(resp => resp.data)
        .then(({ access, refresh }) => {
          localStorage.setItem('token', access)
          localStorage.setItem('refresh', refresh)
          commit('auth_success')
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
        .then(({access, refresh}) => {
          localStorage.setItem('token', access)
          localStorage.setItem('refresh', refresh)
          commit('auth_success')
        })
        .catch(error => {
          console.log(error)
          commit('auth_error')
        })
    },
    updateToken({commit}) {
      const refreshToken = localStorage.getItem('refresh')
      if (!refreshToken) {
        commit('logout')
        return
      }
      authApi.refresh(refreshToken)
        .then(resp => resp.data)
        .then(({ access }) => {
          localStorage.setItem('token', access)
          commit('auth_success')
        })
        .catch(error => console.log(error))
    }
  }
}