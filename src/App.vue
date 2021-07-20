<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    Прогноз опасных явлений 
      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <Map/>
      <Options/>
    </v-main>

    <Footer/>

  </v-app>
</template>

<script>
import Map from './components/Map';
import Footer from './components/Footer'
import Options from './components/Options.vue'

export default {
  name: 'App',

  components: {
    Map,
    Footer,
    Options
  },

  data: () => ({
    //
  }),
};
</script>
