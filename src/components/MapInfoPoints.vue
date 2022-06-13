<template>
  <l-geo-json
    :geojson="geoJSONData"
    :visible="isLogin && isVisible"
    :options="optionsGeoJSON"
    :options-style="styleFunction"
  />
</template>

<script>
import L, {latLng} from 'leaflet'
import { LGeoJson } from "vue2-leaflet";
import { mapState } from "vuex";

export default {
  name: "InfoPoints",
  components: { LGeoJson },
  computed: {
    ...mapState({
      data: state => state.notification.infoPoints,
      isVisible: state => state.notification.listNotificationPointsActive,
      isLogin: state => state.auth.isLogin,
      selectedPoint: state => state.notification.selectedPoint,
      gMap: state => state.gMap
    }),
    selectedPointId() {
      return this.selectedPoint?.id
    },
    geoJSONData() {
      if (this.isVisible && this.data) {
        return this.data;
      } else {
        return [];
      }
    },
    optionsGeoJSON() {
      return {
        onEachFeature: this.onEachFeature,
        pointToLayer: this.pointToLayer,
        style: this.style
      };
    },
    pointToLayer() {
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
    onEachFeature() {
      return (feature, layer) => {
          const tooltipContent =
              "<div>" +
              `Название точки : <b>${feature.properties.name}</b>` +
              "<div>";
          layer.bindPopup(tooltipContent)
       }
    },
    styleFunction() {
      const id = this.selectedPointId; // important! need to save id
      return (feature) => {
        if ( feature && feature.properties?.id === id) {
          return {fillColor: '#000000'}
        } else {
          return {fillColor: '#ff7800'}
        }
      }
    }
  },
  watch: {
    selectedPointId() {
      if(this.selectedPoint.id){
        this.gMap.setView(latLng([this.selectedPoint.Y, this.selectedPoint.X]), 7)
      }
    }
  }
};
</script>

<style>
</style>
