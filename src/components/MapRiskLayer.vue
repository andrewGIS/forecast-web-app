<template>
  <l-geo-json
    :geojson="geoJSONData"
    :visible="!error_get_data && isVisible"
    :options="optionsGeoJSON"
  />
</template>

<script>
  import {LGeoJson} from "vue2-leaflet";
  import {mapGetters, mapMutations, mapState} from "vuex";
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
    ...mapGetters(["SELECTED_HOUR", "SELECTED_DATE", "SELECTED_EVENT_GROUP", "SELECTED_LOCAL_HOUR"]),
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
    ...mapMutations(['ADD_MESSAGE', 'REMOVE_MESSAGE']),
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
            if (r.data.features.length === 0) {
              this.ADD_MESSAGE(`Опасных явлений для выбранного времени не обнаружено`);
              // TODO костыль придумать получше
              setTimeout(() => this.REMOVE_MESSAGE(), 4000)
            } else {
              this.REMOVE_MESSAGE();
            }
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
      return { fillColor: color, weight: 1, color, fillOpacity: 0.6  };
    }
  }
};
</script>

<style>
</style>
