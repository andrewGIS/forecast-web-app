import client from './index'

export default {
  login(data) {
    return client.post('auth/token', data)
  },
  refresh(token) {
    return client.post('auth/refresh-token', {
      token,
    })
  }
}