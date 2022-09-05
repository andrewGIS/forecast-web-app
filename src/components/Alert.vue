<template>
  <v-snackbar
    :value="message"
    timeout="-1"
    bottom
    center
    :style="`bottom: 70px`"
  >
    {{ message }}
    <v-btn icon @click="deleteMessage">
      <v-icon size="16px">
        mdi-close
      </v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
import {mapState, mapMutations} from "vuex";

export default {
  name: "Alert",
  data: () => ({
    isVisible:false,
  }),
  computed:{
    ...mapState({
      message: state => state.infoservice.message
    })
  },
  methods:{
    ...mapMutations({deleteMessage: 'REMOVE_MESSAGE'})
  },
};
</script>

<style>
</style>
