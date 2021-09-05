<template>
  <l-map ref="map">
    <!-- <risk-layer /> -->
    <l-tile-layer :url="osmURL" />

    <!-- <Legend/>
          <Options/>
          <date-picker/> -->
    <Alert />
    <l-tiff
      :url="rasterURL"
      :is-visible="true"
    />
  </l-map>
</template>

<script>
import { LMap, LTileLayer } from "vue2-leaflet";
// import Legend from './Legend.vue'
// import DatePicker from './DatePicker.vue'
import Alert from "./Alert.vue";
import RiskLayer from "./RiskLayer";
import LTiff from "./LTiff.vue";
import { mapState, mapGetters } from "vuex";

export default {
  name: "Map",
  components: {
    LMap,
    LTileLayer,
    // Legend,
    // Options,
    // DatePicker,
    Alert,
    // eslint-disable-next-line vue/no-unused-components
    RiskLayer,
    LTiff
  },

  data: () => ({
    osmURL: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    map: null
  }),
  computed: {
    ...mapState(["selectedModel", "selectedForescatType"]),
    ...mapGetters(["SELECTED_HOUR", "SELECTED_DATE", "SELECTED_EVENT_GROUP"]),
    rasterURL() {
      const baseURL = `${process.env.VUE_APP_API_BASE}/get_forecast?`;
      const params = [
        `model=${this.selectedModel}`,
        `forecast_type=${this.selectedForescatType}`,
        `date=${this.SELECTED_DATE}`,
        `hour=${this.SELECTED_HOUR}`,
        `group=${this.SELECTED_EVENT_GROUP}`,
        "datatype=raster"
      ];
      return baseURL + params.join("&");
    }
  }
};
</script>
