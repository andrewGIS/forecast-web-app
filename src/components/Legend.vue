<template>
  <!-- <l-control position="bottomright" > -->
  <v-snackbar
    timeout="-1"
    right
    :width="30"
    app
    :value="isVisible"
  >
    <v-container fluid>
      <v-row align="center">
        <v-col cols="10">
          Легенда
        </v-col>
        <v-col cols="1">
          <v-btn
            icon
            @click="setLegendVisibility(false)"
          >
            <v-icon size="24px">
              mdi-close
            </v-icon>
          </v-btn>
        </v-col>  
      </v-row>
    </v-container>
  </v-snackbar>
  <!-- </l-control> -->
</template>

<script>
// import { LControl } from 'vue2-leaflet'
import { mapState, mapMutations } from 'vuex'
export default {
  name: "Legend",
  data: () => ({
    snackbar: true
  }),
  computed: {
    ...mapState({
      isVisible: "isLegendVisible"
    }),
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
  methods: {
    ...mapMutations({
      setLegendVisibility: "SET_LEGEND_VISIBILITY"
    })
  },  
  components: {
    // LControl
  }
};
</script>

<style>
</style>
