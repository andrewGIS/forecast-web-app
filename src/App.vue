<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <!--Как можно получить из джанги данные -->
      <!--Оценка риска конвективных ОЯ на территории Урала {{ value }}-->
      <v-toolbar-title class=".d-none .d-sm-flex">
        ОЦЕНКА РИСКА ОПАСНЫХ ПОГОДНЫХ ЯВЛЕНИЙ НА ТЕРРИТОРИИ УРАЛА
      </v-toolbar-title>
      <v-spacer />
      <Controls />
    </v-app-bar>
    <v-main>
      <Map />
    </v-main>
    <list-points />


    <Footer />
  </v-app>
</template>

<script>
import Map from './components/Map';
import Footer from './components/Footer';
import Controls from "@/components/Controls";
import ListPoints from "@/components/ListPoints";



export default {
  name: 'App',
  components: {
    ListPoints,
    Map,
    Footer,
    Controls
  },
};
</script>

<style>
  html { overflow-y: auto }
</style>
