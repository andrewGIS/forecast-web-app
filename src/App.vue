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
      <Legend/>
    </v-main>

    <Footer/>

  </v-app>
</template>

<script>
import Map from './components/Map';
import Footer from './components/Footer'
import Options from './components/Options'
import Legend from './components/Legend'

export default {
  name: 'App',

  components: {
    Map,
    Footer,
    Options,
    Legend
  },

  data: () => ({
    //
  }),
};
</script>
