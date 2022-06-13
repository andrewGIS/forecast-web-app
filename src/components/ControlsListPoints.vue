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
      isListPointVisible: state => state.notification.listNotificationPointsActive,
      gMap: state => state.gMap
    }),
  },
  methods:{
    ...mapActions({
      getData: 'get_info_points'
    }),
    ...mapMutations({
      toggleVisibility: 'SET_INFO_POINTS_VISIBILITY',
    }),
    ...mapMutations(['SET_SELECTED_POINT']),
    onClick() {
      this.getData()
      this.toggleVisibility(!this.isListPointVisible);
      this.SET_SELECTED_POINT({});
      setTimeout(() => {
        this.gMap.invalidateSize();
      }, 0)
    }
  }
}

</script>
