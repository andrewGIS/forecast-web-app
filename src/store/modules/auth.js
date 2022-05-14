import axios from "axios";
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
    //TODO may be transfer to service
    makeAuthRequest({commit}, {baseUrl, data}) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
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
            localStorage.setItem('token', token)
            // TODO исправить почему-то без Bearer в начале нормально не парсилось на беке
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            commit('auth_success', {token})
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    login({commit}, data) {
      //const baseUrl = `${process.env.VUE_APP_API_BASE}/auth/token`
      //dispatch('makeAuthRequest', {baseUrl, data})
      commit('auth_request')
      authApi.login(data)
        .then(resp => {
          const token = resp.access
          localStorage.setItem('token', token)
          commit('auth_success', {token})
        })
        .catch((error) => {
          console.log(error)
          commit('auth_error')
          localStorage.removeItem('token')
        })
    },
    register({dispatch}, data) {
      const baseUrl = `${process.env.VUE_APP_API_BASE}/auth/register`
      dispatch('makeAuthRequest', {baseUrl, data})
    }
  }
}