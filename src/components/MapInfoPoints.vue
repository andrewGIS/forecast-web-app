<template>
  <l-geo-json
    :geojson="geoJSONData"
    :visible="isVisible"
    :options="optionsGeoJSON"
  />
</template>

<script>
import L from 'leaflet'
import {LGeoJson} from "vue2-leaflet";
import {mapState} from "vuex";

export default {
  name: "InfoPoints",
  components: { LGeoJson },
  data: () => ({
    error_get_data: true,
  }),
  computed: {
    ...mapState({
      data: state => state.notification.infoPoints,
      isVisible: state => state.notification.listNotificationPointsActive
    }),
    geoJSONData() {
      if (this.isVisible && this.data) {
        // return this.$store.getters.GET_FILTERED_GEOJSON;
        return this.data;
      } else {
        return [];
      }
    },
    optionsGeoJSON() {
      return {
        onEachFeature: this.onEachFeature,
        pointToLayer: this.pointToLayer
      };
    },
    pointToLayer () {
      return (feature, latlng) => {
        // console.log(feature)
        return L.circleMarker(latlng, {
              radius: 5,
              fillColor: '#ff7800',
              color: '#000',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            }
        )
      }
    },
  },
};
</script>

<style>
</style>
