import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isConfigVisible: false,
    isLegendVisible: false,
    selectedDate: null,
    selectedModel: "gfs",
    selectedForescatType: "00",
    selectedEvent: null,
  },
  getters: {
    SELECTED_HOUR: state => {
      let hour = state.selectedDate.getUTCHours();
      return hour = hour < 10 ? `0${hour}:00` : `${hour}:00`  
    },
    SELECTED_DATE: state => {
      let sDate = state.selectedDate;

      let month = sDate.getUTCMonth() + 1;
      month = month < 10 ? `0${month}` : month.toString();

      let day = sDate.getUTCDate();
      day = day < 10 ? `0${day}` : day.toString();

      return `${sDate.getFullYear()}${month}${day}`;  //sample 20150722
    },
    SELECTED_EVENT_GROUP: state => state.selectedEvent ? state.selectedEvent.name : null
  },
  mutations: {
    SET_CONFIG_VISIBILITY(state, payload) {
      state.isConfigVisible = payload;
    },
    SET_LEGEND_VISIBILITY(state, payload) {
      state.isLegendVisible = payload;
    },
    SET_FORECAST_TYPE(state, payload) {
      state.selectedForescatType = payload;
    },
    SET_MODEL(state, payload) {
      state.selectedModel = payload;
    },
    SET_SELECTED_EVENT(state, payload) {
      state.selectedEvent = payload;
    },
    SET_SELECTED_DATE(state, payload) {
      state.selectedDate = payload;
    },
  },
  actions: {},
});
