<template>
  <v-container style="height:90vh">
        <l-map>
          <l-tile-layer :url="osmURL"></l-tile-layer>
          <Legend/>
          <Options/>
          <date-picker/>
        </l-map>
  </v-container>
</template>

<script>

import { LMap, LTileLayer } from 'vue2-leaflet'
import Legend from './Legend.vue'
import Options from './Options.vue'
import DatePicker from './DatePicker.vue'

  export default {
    name: 'Map',

    data: () => ({
      osmURL: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    }),
    components:{
      LMap,
      LTileLayer,
      Legend,
      Options,
      DatePicker
    }
  }
</script>
