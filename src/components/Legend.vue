<template>
  <v-snackbar
    timeout="-1"
    right
    :width="30"
    app
    :value="isVisible"
    :style="{zIndex:1002}"
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
        class="pa-0 ma-n2 legendLabel"
        :align="'center'"
      >
        <v-col cols="2">
          <div :style="{backgroundColor:item.color, width: 20 + 'px', height: 20 + 'px'}">
            <!--{{ item.color }}-->
          </div>
        </v-col>
        <v-col cols="10">
          <span class="legendLabel">
            {{ item.alias }}
            <br>
            {{ `Уровень риска ${item.levelCode} ` }}
          </span>
        </v-col>
        <v-row />
      </v-row>
      <v-row
        v-if="indexActive" 
        class="pa-0 ma-n2 legendLabel" 
      >
        <v-col cols="1">
          <div 
            class="color" 
            :style="{'background-image':'linear-gradient(to bottom, '+ indexColor.join(',') +')'}"
          />
        </v-col>
        <v-col cols="2">
          <div> 
            <div class="rasterColorMapFirstValue">
              {{ parseInt(indexRange[0]) }}
            </div> 
            <div>{{ parseInt(indexRange[1]) }}</div>
          </div>
        </v-col>
        <v-col cols="9">
          Значения вспомогательного растра
        </v-col>
      </v-row>
      <v-row
        v-if="selectedDisplayType === 'raster'" 
        class="pa-0 ma-n2 legendLabel" 
      >
        <v-col cols="1">
          <div 
            class="color" 
            :style="{'background-image':'linear-gradient(to bottom, '+ riskColor.join(',') +')'}"
          />
        </v-col>
        <v-col cols="2">
          <div> 
            <div class="rasterColorMapFirstValue">
              {{ parseInt(indexRange[0]) }}
            </div> 
            <div>{{ parseInt(indexRange[1]) }}</div>
          </div>
        </v-col>
        <v-col cols="9">
          Уровень риска
        </v-col>
      </v-row>
    </v-container>
  </v-snackbar>
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
    ...mapState(["selectedModel",
      "selectedDisplayType",
      "indexActive",
      "colorRange",
      "indexRange",
      "riskColor",
      "indexColor"
    ]),
    ...mapState(
      {
      isVisible: "isLegendVisible"
    })
  },
  watch:{
    async selectedDisplayType (newValue) {
      if (newValue ==='vector') {
        try{
          this.legendVector = await this.getVectorLegend()
        } catch  {
            return
        }
      }
      if (newValue === 'raster') {
        this.legendVector = []
      }
    },
    SELECTED_EVENT_GROUP () {
      this.legendVector = this.getVectorLegend()
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
      try{
        const data = await fetch(url).then(r => r.json());
        return data
      } catch (e) {
        return null
      }
    }
  }
};
</script>

<style scoped>
  .color {
    width: 20px;
    height: 40px;
  }
  .legendLabel {
    font-size: 12px;
  }
  .rasterColorMapFirstValue{
    padding-bottom: 11px;
    margin-top: -4px;
  }   
</style>>
