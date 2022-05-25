import axios from 'axios'
//import store from '../store'
// TODO разобраться с авторизованными запросами и нет
// TODO все запросы сделать через клиента

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const client = axios.create({
  baseURL: process.env.VUE_APP_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

client.interceptors.response.use(null, (error) => {
  if (
    error.response?.config & (error.response?.status === 401) ||
    error.response?.status === 403
  ) {
    //store.dispatch('auth/logout')
    return error.response
  }

  return Promise.reject(error)
})

client.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem(
      'token'
    )}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default client