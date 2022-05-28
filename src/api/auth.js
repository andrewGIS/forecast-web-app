import client, { anonClient }  from './index'

export default {
  register(data){
    return anonClient.post('auth/register', data)
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