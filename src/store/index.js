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
      let hoursMap = {
        3: "03",
        6: "06",
        9: "09",
        12: "12",
        15: "15",
        18: "18",
        21: "21",
      };

      return hoursMap[state.selectedDate.getHours()];
    },
    SELECTED_DATE: state => {
      let sDate = state.selectedDate;

      let month = sDate.getMonth() + 1;
      month = month < 10 ? `0${month}` : month.toString();

      let day = sDate.getDate();
      day = day < 10 ? `0${day}` : day.toString();

      return `${sDate.getFullYear()}${month}${day}`;
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
