<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <Map/>
    </v-main>


  </v-app>
</template>

<script>
import Map from './components/Map';

export default {
  name: 'App',

  components: {
    Map
  },

  data: () => ({
    //
  }),
};
</script>
