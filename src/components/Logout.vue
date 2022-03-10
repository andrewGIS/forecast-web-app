<template>
  <v-btn icon>
    <v-icon @click="logout">
      mdi-logout
    </v-icon>
  </v-btn>
</template>

<script>
  import {mapMutations} from 'vuex'
  export default {
    name: "Logout",
    methods: {
      ...mapMutations({logout: 'logout'})
    }
  }
</script>

<style scoped>

</style>