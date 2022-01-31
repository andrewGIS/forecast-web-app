import Vue from "vue";
import Vuex from "vuex";
import {formatAsUTCDate} from '../utils/utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isConfigVisible: false,
    isLegendVisible: false,
    selectedDate: null,
    selectedModel: "gfs",
    selectedForescatType: "00",
    selectedEvent: null,
    selectedIndex: null,
    indexActive: false,
    selectedDisplayType: "vector",
    indexRange: [0,0],
    riskRange: [4,0],
    indexColor: ["yellow", "#008ae5"], // Градация цветов для отображения растра растров индексов
    riskColor: ["#ff9999", "#330000"], // Градация цветов для отображения растра риска появления явления
    // TODO get from backend
    forecastHours: [
      {
        value: 3,
        label: "03:00"
      },
      {
        value: 6,
        label: "06:00"
      },
      {
        value: 9,
        label: "09:00"
      },
      {
        value: 12,
        label: "12:00"
      },
      {
        value: 15,
        label: "15:00"
      },
            {
        value: 18,
        label: "18:00"
      },
      {
        value: 21,
        label: "21:00"
      },
      {
        value: 24,
        label: "24:00"
      }],
  },
  getters: {
    // Выбранный час в UTС
    SELECTED_HOUR: state => {

      if (!state.selectedDate) { 
        return ""
      }

      let value = state.selectedDate.getUTCHours();
      // Считаем наиболее близкий прогноз с учетом смещения от UTC
      // учитываем что у нас прогноз с разрезом 3 часа, хотя это неважно,
      // мы берем из тех, которые указаны в forecastHours
      const hours = state.forecastHours.map(h=>h.value)
      const diffs = hours.map(h => Math.abs(value-h));
      let hour = hours[diffs.indexOf(Math.min(...diffs))];
      if (hour === 0){
        return '24'
      }
      return hour = hour < 10 ? `0${hour}` : `${hour}`
    },
    //Выбранная дата в UTC
    SELECTED_DATE: state => {

      if (!state.selectedDate) { 
        return ""
      }

      return formatAsUTCDate(state.selectedDate)  //sample 20150722
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
    SET_SELECTED_INDEX(state, payload) {
      state.selectedIndex = payload;
    },
    SET_SELECTED_DATE(state, payload) {
      state.selectedDate = payload;
    },
    SET_INDEX_VISIBILITY(state, payload) {
      state.indexActive = payload;
    },
    SET_SELECTED_DISPLAY_TYPE(state, payload) {
      state.selectedDisplayType = payload;
    },
    SET_INDEX_RANGE(state, payload) {
      state.indexRange = payload;
    },
  },
  actions: {},
});
