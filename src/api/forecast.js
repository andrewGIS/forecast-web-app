import {anonClient} from './index'

export default {
  dates(modelName) {
    return anonClient.get('/get_dates', {
      params: {
        model:modelName
      }
    })
  }
}