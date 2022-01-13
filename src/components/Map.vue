<template>
  <!-- FIXME temp solution minZoom for correct display ltiff-->
  <l-map
    ref="map"
    :min-zoom="3"
  >
    <risk-layer :is-visible="selectedDisplayType === 'vector'" />
    <l-tile-layer :url="osmURL" />

    <!-- <Legend/>
          <Options/>
          <date-picker/> -->
    <!-- <Alert /> -->
    <l-tiff 
      :is-visible="indexActive"
      :url="indexURL" 
      :info-popup="true"
      :type-raster="'index'"
    />
    <l-tiff 
      :is-visible="selectedDisplayType === 'raster'"
      :url="rasterURL" 
      :info-popup="true"
      :type-raster="'not-index'"
    />
  </l-map>
</template>

<script>
import { LMap, LTileLayer } from "vue2-leaflet";
// import Legend from './Legend.vue'
// import DatePicker from './DatePicker.vue'
//import Alert from "./Alert.vue";
import RiskLayer from "./RiskLayer";
import LTiff from "./LTiff.vue";
import { mapState, mapGetters } from "vuex";
import {latLng} from "leaflet";

export default {
  name: "Map",
  components: {
    LMap,
    LTileLayer,
    // Legend,
    // Options,
    // DatePicker,
    // Alert,
    // eslint-disable-next-line vue/no-unused-components
    RiskLayer,
    LTiff
  },

  data: () => ({
    osmURL: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    map: null
  }),
  computed: {
    ...mapState(["selectedModel", "selectedForescatType","selectedIndex","indexActive", "selectedDisplayType"]),
    ...mapGetters(["SELECTED_HOUR", "SELECTED_DATE", "SELECTED_EVENT_GROUP"]),
    rasterURL() {
      const baseURL = `${process.env.VUE_APP_API_BASE}/get_forecast?`;
      const params = [
        `model=${this.selectedModel}`,
        `forecast_type=${this.selectedForescatType}`,
        `date=${this.SELECTED_DATE}`,
        `hour=${this.SELECTED_HOUR}`,
        `group=${this.SELECTED_EVENT_GROUP}`,
        `datatype=${this.selectedDisplayType}`
      ];
      return baseURL + params.join("&");
    },
    indexURL () {
      //`http://localhost:5000/api/v1/get_index?model=icon&date=20210721&forecast_type=00&hour=03&index_name=dls`
      const baseURL = `${process.env.VUE_APP_API_BASE}/get_index?`;

      const params = [
        `model=${this.selectedModel}`,
        `forecast_type=${this.selectedForescatType}`,
        `date=${this.SELECTED_DATE}`,
        `hour=${this.SELECTED_HOUR}`,
        `index_name=${this.selectedIndex}`
      ];

      return baseURL + params.join("&");

    }
  },
  mounted(){
    navigator.geolocation.getCurrentPosition(this.geoSuccess, ()=>{})
  },
  methods:{
    geoSuccess(e) {
      this.$refs.map.mapObject.setView(latLng(e.coords.latitude, e.coords.longitude), 5)
    }
  }
};

</script>
