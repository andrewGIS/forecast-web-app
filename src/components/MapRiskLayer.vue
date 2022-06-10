<template>
  <l-geo-json
    :geojson="geoJSONData"
    :visible="!error_get_data && isVisible"
    :options="optionsGeoJSON"
  />
</template>

<script>
  import {LGeoJson} from "vue2-leaflet";
  import {mapGetters, mapState} from "vuex";
  import forecastApi from "@/api/forecast";

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
        field: "level_code",
        alias: "Уровень риска"
      }
    ],
    error_get_data: true,
    style: () => {}
  }),
  computed: {
    ...mapState([
      "selectedModel"
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
    selectedParams() {
      const selectedParams = [
        `model=${this.selectedModel}`,
        `date=${this.SELECTED_DATE}`,
        `hour=${this.SELECTED_HOUR}`,
        `group=${this.SELECTED_EVENT_GROUP}`,
      ];
      return selectedParams.join("&");
    }
  },
  watch: {
    async selectedParams() {
      this.data = await this.getGeoJSONData(this.geojsonURL);
    },
    async SELECTED_EVENT_GROUP() {
      await forecastApi.legend({
        model: this.selectedModel,
        group: this.SELECTED_EVENT_GROUP,
      })
          .then(r => {
                this.style = feature => {
                     return this.findColor(r.data, feature.properties.level_code);
                };
      });
    }
  },
  methods: {
    async getGeoJSONData() {
      const params = {
          "model":this.selectedModel,
          "date": this.SELECTED_DATE,
          "hour":this.SELECTED_HOUR,
          "group": this.SELECTED_EVENT_GROUP,
          "datatype": "vector",
      };
      const data = await forecastApi.forecast(params)
          .then(r => {
            this.error_get_data = false;
            return r.data;
          })
          .catch(error => {
            console.log(error);
            this.error_get_data = true;
            return null
          })
      return data
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
