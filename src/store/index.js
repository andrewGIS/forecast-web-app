import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    aviableEventGroup: [{}],
    isConfigVisible: false,
    selectedDate: null,
    selectedModel: 'gfs',
    selectedForescatType: '00'
  },
  mutations: {
    SET_CONFIG_VISIBILITY(state, payload){
      state.isConfigVisible = payload
    },
    SET_FORECAST_TYPE(state, payload){
      state.selectedForescatType = payload
    },
    SET_MODEL(state, payload){
      state.selectedModel = payload
    }
  },
  actions: {
  }
})
