<template>
  <!-- <l-control position="bottomright" > -->
  <v-snackbar
    timeout="-1"
    right
    :width="30"
    app
    light
    :value="isVisible"
  >
     
    <v-container fluid>
      <v-row align="center">
        <v-col cols="10" >
          Легенда
        </v-col>
        <v-col cols="1">
          <v-btn icon @click="setLegendVisibility(false)">
            <v-icon size="24px"> mdi-close </v-icon>
          </v-btn>
        </v-col>  
      </v-row>

      <v-container fluid >
        <v-row>
          <v-col style="padding:0" cols="1">
            <div class="color" :style="{'background-image': 'linear-gradient(to bottom, '+ colorString +')', 'height': '100%'}"></div>
          </v-col>
          <v-col style="padding:0" cols="1" align-self="start">
            <div class="labels">
              <template v-for="entry in entryString">
                <p :key="entry" height = 30px> 
                  {{(parseFloat(entry).toFixed(1))}}
                </p>
              </template>
            </div>
          </v-col>
        </v-row> 
      </v-container>
    </v-container> 

  </v-snackbar>
  <!-- </l-control> -->
</template>

<script>
var colors = [
  {
    "color": ,
    "value": 250.256
  }
]
var colors = ['#d63a3a 250.256','#d5e868 107.562','#b1e868 104.538', '#ffffff 0', '#b1e868 104.538','#d5e868 107.562','#d63a3a 250.256']
// import { LControl } from 'vue2-leaflet'
import { mapState, mapMutations } from 'vuex'
export default {
  data: () => ({
    snackbar: true
  }),
  name: "Legend", 
  computed: {
    ...mapState({
      isVisible: "isLegendVisible"
    }),
    legendData() {
      return {};
    },
    entryString() {
      var entryStringArray = [];
      for (var i= 0; i < colors.length; i++) {
        entryStringArray.push(colors[i].slice(colors[i].lastIndexOf(' '), colors[i].length));
      }
      return entryStringArray
    },
    gradientHeight() {
      var oneColorHeight = 30;
      return String(oneColorHeight*colors.length + 'px')
    },
    colorString() {
      var colorStringArray = [];
      for (var i= 0; i < colors.length; i++) {
        colorStringArray.push(colors[i].slice(0, colors[i].indexOf(' ')));
      }
      return colorStringArray.join(', ');
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
.color {
    width: 20px;
  }
.labels p {
  margin: 0;
  padding: 0;
}
</style>
