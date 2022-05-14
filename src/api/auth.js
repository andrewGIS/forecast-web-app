import client from './index'
import axios from "axios";

export default {
  // TODO унифицировать с общим клиентом
  register(data){
    return axios.post('auth/register', data, {
      baseURL: process.env.VUE_APP_API_BASE,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    })
  },
  login(data) {
    return client.post('auth/token', data)
  },
  refresh(token) {
    return client.post('auth/refresh-token', {
      token,
    })
  }
}