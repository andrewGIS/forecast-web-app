<template>
  <l-map
    ref="map"
    :min-zoom="3"
    :center="center"
    @mousemove="onMouseMove"
  >
    <l-marker 
      v-if="userPosition"
      :lat-lng="userPosition"
    >
      <l-popup>Ваша геопозиция</l-popup>
    </l-marker>
    <risk-layer :is-visible="selectedDisplayType === 'vector'" />
    <info-points />
    <l-tile-layer
      :url="osmURL"
    />

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
    <l-control
      v-if="mousePosition"
      position="bottomleft"
      class="map__mouse_control_info text-caption"
      v-html="mousePosition"
    />
  </l-map>
</template>

<script>
import { LMap, LMarker, LTileLayer, LPopup, LControl } from "vue2-leaflet";
import RiskLayer from "./MapRiskLayer";
import LTiff from "./LTiff.vue";
import { mapState, mapGetters } from "vuex";
import {latLng} from "leaflet";

import { Icon } from 'leaflet';

import {mapActions} from 'vuex';
import InfoPoints from "@/components/MapInfoPoints";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  name: "Map",
  components: {
    InfoPoints,
    LMap,
    LTileLayer,
    RiskLayer,
    LTiff,
    LMarker,
    LPopup,
    LControl
  },

  data: () => ({
    osmURL: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    map: null,
    userPosition: null,
    center: [59, 58],
    mousePosition: null,
  }),
  computed: {
    ...mapState(["selectedModel","selectedIndex","indexActive", "selectedDisplayType"]),
    ...mapGetters(["SELECTED_HOUR", "SELECTED_DATE", "SELECTED_EVENT_GROUP"]),
    rasterURL() {
      // TODO выпилить
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
      // TODO выпилить
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
    this.updateToken();
  },
  methods:{
    ...mapActions(['updateToken']),
    geoSuccess(e) {
      this.$refs.map.mapObject.setView(latLng(e.coords.latitude, e.coords.longitude), 5);
      this.userPosition = latLng(e.coords.latitude, e.coords.longitude);
    },
    onMouseMove(e) {
      this.mousePosition =
          `<b>Долгота</b> - ${e.latlng.lng.toPrecision(6)},
           <b>Широта</b> - ${e.latlng.lat.toPrecision(6)}`;
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
   .map__mouse_control_info {
     background: white;
     padding-left: 1px;
     margin-left: 0px !important;
     margin-bottom: 0px !important;
   }
</style>
