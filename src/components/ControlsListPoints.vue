<template>
  <v-btn icon @click="onClick">
    <v-icon>
      mdi-format-list-bulleted
    </v-icon>
  </v-btn>
</template>

<script>
import {mapState, mapActions, mapMutations} from "vuex";

export default {
  name: 'ListPoints',
  computed: {
    ...mapState({
      isLogin: state => state.auth.isLogin,
      isListPointVisible: state => state.notification.listNotificationPointsActive
    }),
  },
  methods:{
    ...mapActions({
      getData: 'get_info_points'
    }),
    ...mapMutations({
      toggleVisibility: 'SET_INFO_POINTS_VISIBILITY',
    }),
    onClick() {
      this.getData()
      this.toggleVisibility(!this.isListPointVisible)
    }
  }
}

</script>
