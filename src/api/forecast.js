import {anonClient} from './index'

export default {
  dates(modelName) {
    return anonClient.get('get_dates/', { params: { model:modelName } })
  },
  indexes(modelName) {
    return anonClient.get('indexes/', { params: { model:modelName } })
  },
  models() {
    return anonClient.get('models/')
  },
  eventGroups(modelName) {
    return anonClient.get('event_groups/', { params: { model:modelName } })
  },
  legend(data) {
    return anonClient.get('get_legend/', {params:data})
  },
  forecast(data) {
    return anonClient.get('get_forecast/', {params: data })
  }
}