<template>
  <l-geo-json :geojson="geoJSONData" :visible="geoJSONVisibility"> </l-geo-json>
</template>

<script>
import { LGeoJson } from "vue2-leaflet";
import { mapGetters, mapState } from 'vuex';
export default {
  data:() => ({
      GJdata: null
  }),
  name: "RiskLayer",
  computed: {
    ...mapState([
      'selectedModel',
      'selectedForescatType'
      ]),
    ...mapGetters([
      'SELECTED_HOUR',
      'SELECTED_DATE',
      'SELECTED_EVENT_GROUP'
    ]),
    geoJSONData() {
      if (this.geoJSONVisibility && this.GJdata) {
        // return this.$store.getters.GET_FILTERED_GEOJSON;
        return this.GJdata
      } else {
        return [];
      }
    },
    geoJSONVisibility() {
      return true;
    },
    optionsGeoJSON() {
      return {
        onEachFeature: this.onEachFeature,
        //pointToLayer: this.pointToLayer
      };
    },
    onEachFeature() {
      return (feature, layer) => {
        const tooltipContent = (accumulator, currentValue) =>
          accumulator +
          "<div>" +
          `${currentValue.alias} : ${feature.properties[currentValue.field]}` +
          "<div>";
        layer.bindTooltip(this.tooltipFields.reduce(tooltipContent, ""));
        if (this.clickGEOJSON) {
          layer.on({
            click: e => {
              this.$store.commit(
                "ADD_WMO_NAME",
                e.target.feature.properties.name
              );
              console.log(e.target.feature);
              // e.layer.setStyle({
              //   weight: 5
              // })
            }
          });
        }
      };
    },
    geojsonURL (){
      // return `${process.env.VUE_APP_API_BASE}/get_forecast/?model=${this.selectedModel}&forecast_type=${this.selectedForescatType}&date=${this.SELECTED_DATE}&hour=${this.SELECTED_HOUR}&group=${this.SELECTED_EVENT_GROUP}`
      return `${process.env.VUE_APP_API_BASE}/get_forecast/?model=gfs&forecast_type=12&date=20210515&hour=15&group=squall_L2`
    }
  },
  methods: {
    getGeoJSONData(url) {
        fetch(
      //`${process.env.VUE_APP_API_BASE}/get_forecast/?model=gfs&forecast_type=12&date=20210515&hour=15&group=squall_L2`
      url
      
    )
      .then(res => res.json())
      .then(data => data);
    }
  },
  // mounted (){
  //     this.getGeoJSONData()
  // },
  watch:{
    geojsonURL: function(url){
      this.GJdata = this.getGeoJSONData(url);
    }
  },
  components: { LGeoJson }
};
</script>

<style>
</style>
