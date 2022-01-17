<template>
  <l-geo-json
    :geojson="geoJSONData"
    :visible="!error_get_data && isVisible"
    :options="optionsGeoJSON"
  />
</template>

<script>
import { LGeoJson } from "vue2-leaflet";
import { mapGetters, mapState } from "vuex";
export default {
  name: "RiskLayer",
  components: { LGeoJson },
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    data: null,
    tooltipFields: [
      {
        field: "level_risk",
        alias: "Уровень риска"
      }
    ],
    error_get_data: true,
    style: () => {}
  }),
  computed: {
    ...mapState([
      "selectedModel",
      "selectedForescatType",
      "SELECTED_EVENT_GROUP"
    ]),
    ...mapGetters(["SELECTED_HOUR", "SELECTED_DATE", "SELECTED_EVENT_GROUP"]),
    geoJSONData() {
      if (this.isVisible && this.data && !this.error_get_data) {
        // return this.$store.getters.GET_FILTERED_GEOJSON;
        return this.data;
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
        style: this.style,
      };
    },
    // style() {
    //   return feature => {
    //     switch (feature.properties.level_risk) {
    //       case 1:
    //         return { fillColor: "#cd363c" , weight: 1, color: "#cd363c"  };
    //       case 2:
    //         return { fillColor: "#e24a4b" , weight: 1, color: "#e24a4b"  };
    //       case 3:
    //         return { fillColor: "#ff6663" , weight: 1, color: "#ff6663" };
    //       case 4:
    //         return { fillColor: "#ff6f6b", weight: 1, color: "#ff6f6b"};
    //     }
    //   };
    // },
    onEachFeature() {
      return (feature, layer) => {
        const tooltipContent = (accumulator, currentValue) =>
          accumulator +
          "<div>" +
          `${currentValue.alias} : ${feature.properties[currentValue.field]}` +
          "<div>";
        layer.bindTooltip(this.tooltipFields.reduce(tooltipContent, ""));
      };
    },
    geojsonURL() {
      const baseURL = `${process.env.VUE_APP_API_BASE}/get_forecast?`;
      const params = [
        `model=${this.selectedModel}`,
        //`forecast_type=${this.selectedForescatType}`,
        `date=${this.SELECTED_DATE}`,
        `hour=${this.SELECTED_HOUR}`,
        `group=${this.SELECTED_EVENT_GROUP}`,
        "datatype=vector"
      ];
      return baseURL + params.join("&");
    }
  },
  // mounted (){
  //     this.getGeoJSONData()
  // },
  watch: {
    async geojsonURL() {
      //console.log(this.geojsonURL);
      // # TODO check it go it to async method
      const result = await this.getGeoJSONData(this.geojsonURL);
      this.data = result;

      // .then(data => (this.data = data)
      // .catch(error => {
      //   console.log(error)
      //   this.error_get_data = true;
      // }));
      //console.log(this.getGeoJSONData(this.geojsonURL));
      //this.data = this.getGeoJSONData(this.geojsonURL);
    },
    async SELECTED_EVENT_GROUP() {
      const baseURL = `${process.env.VUE_APP_API_BASE}/get_legend?`;
      const params = [
        `model=${this.selectedModel}`,
        `group=${this.SELECTED_EVENT_GROUP}`
      ];
      const url = baseURL + params.join("&");

      let data = await fetch(url).then(r => r.json());

      this.style = feature => {
        return this.findColor(data, feature.properties.level_risk);
      };
    }
  },
  methods: {
    async getGeoJSONData(url) {
      try {
        let response = await fetch(url);
        let result = await response.json();
        if (!response.ok) {
          return null;
        }
        this.error_get_data = false;
        return result;
      } catch (error) {
        console.log(error);
        this.error_get_data = true;
        return null;
      }
    },
    findColor(data, code) {
      const { color } = data.find(({ levelCode }) => levelCode === code);
      return { fillColor: color, weight: 1, color };
    }
  }
};
</script>

<style>
</style>
