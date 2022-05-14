<template>
  <l-map
    ref="map"
    :min-zoom="3"
  >
    <l-marker 
      v-if="postitonLatLng" 
      :lat-lng="postitonLatLng"
    >
      <l-popup>Ваша геопозиция</l-popup>
    </l-marker>
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
import { LMap, LMarker, LTileLayer, LPopup } from "vue2-leaflet";
// import Legend from './Legend.vue'
// import DatePicker from './DatePicker.vue'
//import Alert from "./Alert.vue";
import RiskLayer from "./RiskLayer";
import LTiff from "./LTiff.vue";
import { mapState, mapGetters } from "vuex";
import {latLng} from "leaflet";

import { Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
    LTiff,
    LMarker,
    LPopup
  },

  data: () => ({
    osmURL: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    map: null,
    postitonLatLng: null
  }),
  computed: {
    ...mapState(["selectedModel","selectedIndex","indexActive", "selectedDisplayType"]),
    ...mapGetters(["SELECTED_HOUR", "SELECTED_DATE", "SELECTED_EVENT_GROUP"]),
    rasterURL() {
      const baseURL = `${process.env.VUE_APP_API_BASE}/get_forecast?`;
      const params = [
        `model=${this.selectedModel}`,
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
      this.$refs.map.mapObject.setView(latLng(e.coords.latitude, e.coords.longitude), 5);
      this.postitonLatLng = latLng(e.coords.latitude, e.coords.longitude);
    }
  }
};

</script>
<style>
   /* TODO придумать что то получше */
   /* TODO посмотреть где это еще может повлиять убрать z-index где добавлено было из-за этого*/
  .leaflet-pane {
    z-index: 200 !important; /* Как у v-main*/
  }
</style>
