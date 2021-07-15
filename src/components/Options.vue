<template>
  <l-control position="bottomleft" >
    <v-container fluid>
        <br> Тип прогноза         
        <v-select
          :items="forecastType"
          filled
          label="Filled style"
          dense
          solo
        ></v-select>
        <br> Модель
                <v-select
          :items="models"
          filled
          label="Filled style"
          dense
          solo
        ></v-select>
        <br> Явление
                <v-select
          :items="items"
          filled
          label="Filled style"
          dense
          solo
        ></v-select>
    </v-container>
  </l-control>
</template>

<script>
import { LControl } from 'vue2-leaflet'
export default {
  data:()=>({
    forecastType: ['00', '12'],
    models: ['gfs', 'icon'],
    items:['Foo', 'Bar', 'Fizz', 'Buzz']
  }),
  name: 'Options',
  components: {
    LControl
  }
}
</script>

<style>

</style>
