<template>
  <v-snackbar
    :value="message !== null"
    :timeout="-1"
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
    timeoutId: null,
  }),
  computed:{
    ...mapState({
      message: state => state.infoservice.message
    })
  },
  watch:{
    message(value) {
      if (value) {
        this.timeoutId = setTimeout(() => {
          this.deleteMessage()
          this.timeoutId = null
        }, 4000)
      } else {
        if (this.timeoutId) clearTimeout(this.timeoutId);
      }
    }
  },
  methods:{
    ...mapMutations({deleteMessage: 'REMOVE_MESSAGE'})
  }
};
</script>

<style>
</style>
