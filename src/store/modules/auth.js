export default {
  state: {
    status: 'not success',
    token: localStorage.getItem('token') || '',
    user: {}
  },
  getters: {

  },
  mutations: {
    auth_request(state) {
    state.status = 'loading'
  },
  auth_success(state, payload) {
    state.status = 'success'
    state.token = payload.token;
    //state.user = payload.user;
  },
  auth_error(state) {
    state.status = 'error'
  }, logout(state) {
      state.status = ''
      state.token = ''
    },
  },
  actions: {
    login({commit}, data) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        const baseUrl = `${process.env.VUE_APP_API_BASE}/auth/token`
        fetch(baseUrl, {
          body: JSON.stringify(data),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        })
          .then(r => r.json())
          .then(resp => {
          const token = resp.access
          //const user = resp.data.user
          const user = {}

          localStorage.setItem('token', token)
          //axios.defaults.headers.common['Authorization'] = token
          commit('auth_success', { token, user })
          resolve(resp)
        })
          .catch(err => {
          commit('auth_error')
          localStorage.removeItem('token')
          reject(err)
        })
      })
    },
  }
}