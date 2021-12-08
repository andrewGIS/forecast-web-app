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
      <v-row
        v-for="(item,index) in legendVector" 
        :key="index"
        class="pa-0 ma-n2"
        :align="'center'"
      >
        <v-col cols="2">
          <div :style="{backgroundColor:item.color, width: 20 + 'px', height: 20 + 'px'}">
            <!--{{ item.color }}-->
          </div>
        </v-col>
        <v-col cols="10">
          <span :style="{fontSize: 12 + 'px'}">
            {{ item.alias }}
            <br>
            {{ `Уровень риска ${item.levelCode} ` }}
          </span>
        </v-col>
        <v-row />
      </v-row>
    </v-container>
  </v-snackbar>
  <!-- </l-control> -->
</template>

<script>
// import { LControl } from 'vue2-leaflet'
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: "Legend",
  components: {
    // LControl
  },
  data: () => ({
    snackbar: true,
    legendVector: []
  }),
  computed: {
    ...mapGetters(["SELECTED_EVENT_GROUP"]),
    ...mapState(["selectedModel", "selectedDisplayType"]),
    ...mapState(
      {
      isVisible: "isLegendVisible"
    }),
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
  watch:{
    async selectedDisplayType (newValue) {
      if (newValue ==='vector') {
        this.legendVector = await this.getVectorLegend()
      }
      if (newValue === 'raster') {
        this.legendVector = []
      }
    },
    async SELECTED_EVENT_GROUP () {
      this.legendVector = await this.getVectorLegend()
    }
  },
  async mounted() {
    this.legendVector = await this.getVectorLegend()
  },
  methods: {
    ...mapMutations({
      setLegendVisibility: "SET_LEGEND_VISIBILITY"
    }),
    async getVectorLegend() {

      if (!this.SELECTED_EVENT_GROUP) return [];

      const baseURL = `${process.env.VUE_APP_API_BASE}/get_legend?`;
      const params = [
        `model=${this.selectedModel}`,
        `group=${this.SELECTED_EVENT_GROUP}`
      ];
      const url = baseURL + params.join("&");

      let data = await fetch(url).then(r => r.json());
      return data
    }
  }
};
</script>

<style>
</style>
