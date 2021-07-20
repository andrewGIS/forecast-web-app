<template>
  <!-- <l-control position="bottomright" > -->
  <v-snackbar
    v-model="snackbar"
    timeout="-1"
    right
    width=30
    app
  >
      <!-- <b-row>
            <div class='legend-title'>Легенда
            </div>
        </b-row>
        <b-row>
            <div class='units'>Единицы:
            </div>
        </b-row>
        <b-row>
            <div class='units'> {{this.units}}
            </div>
        </b-row>
        <b-row>
            <b-col style="padding:0">
              <div class="color" :style="{'background-image':'linear-gradient(to bottom, '+ colorString +')'}"></div>
            </b-col>
            <b-col style="padding:0">
                <div class="labels">
                  <template v-for="colorMap in sortedColorMaps">
                      <p :key="colorMap.quantity"> {{parseFloat(colorMap.quantity).toFixed(1)}} </p>
                  </template>
                </div>
            </b-col>
        </b-row> -->
      Легенда
  </v-snackbar>
  <!-- </l-control> -->
</template>

<script>
// import { LControl } from 'vue2-leaflet'
export default {
  data: () => ({
    snackbar: true
  }),
  name: "Legend",
  computed: {
    legendData() {
      return {};
    },
    colorMaps() {
      if (!this.$_.isEmpty(this.legendData)) {
        return this.legendData.Legend[0].rules[0].symbolizers[0].Raster.colormap
          .entries;
      } else {
        return {};
      }
    },
    sortedColorMaps() {
      if (!this.$_.isEmpty(this.legendData)) {
        const initArray = this.colorMaps;
        return initArray.sort((a, b) => {
          return -(parseFloat(a.quantity) - parseFloat(b.quantity));
        });
      } else {
        return {};
      }
    },
    colorString() {
      if (!this.$_.isEmpty(this.legendData)) {
        return this.$_.map(this.sortedColorMaps, "color").join(",");
      } else {
        return "";
      }
    },
    units() {
      if (!this.$_.isEmpty(this.legendData)) {
        return `${this.legendData.Legend[0].rules[0].title}`;
      } else {
        return "Нет данных";
      }
    },
    visible() {
      return true;
    }
  },
  components: {
    // LControl
  }
};
</script>

<style>
</style>
