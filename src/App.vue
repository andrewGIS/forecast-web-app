<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <!--Как можно получить из джанги данные -->
      <!--Оценка риска конвективных ОЯ на территории Урала {{ value }}-->
      Оценка риска конвективных ОЯ на территории Урала
      <v-spacer />
      <order-notification v-if="isLogin" />
      <auth v-if="!isLogin" />
      <logout v-if="isLogin" />
    </v-app-bar>

    <v-main>
      <Map />
      <Options />
      <Legend />
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
import Map from './components/Map';
import Footer from './components/Footer'
import Options from './components/Options'
import Legend from './components/Legend'
import Auth from "./components/Auth";
import OrderNotification from "./components/OrderNotification";
import Logout from "./components/Logout";
import {mapState} from "vuex";

export default {
  name: 'App',

  components: {
    Logout,
    OrderNotification,
    Auth,
    Map,
    Footer,
    Options,
    Legend
  },

  data: () => ({
    value: null
  }),
  computed: {
    ...mapState({
      isLogin: state => state.auth.isLogin
    })
  },
  mounted() {
    //this.value = JSON.parse(document.getElementById('hello-data').textContent)
  },

};
</script>

<style>
  html { overflow-y: auto }
</style>
