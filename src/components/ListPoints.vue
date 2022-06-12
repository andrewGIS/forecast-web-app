<template>
  <v-data-table
    v-if="isPointsActive"
    color="white"
    :headers="headers"
    :items="properties"
    :options="dataTableOptions"
  />
</template>

<script>
import {mapActions, mapState} from "vuex";
export default {
  data: () => ({
    isMobile: false,
    dialog: true,
    headers: [
      {text: 'ID', value: 'id'},
      {text: 'Долгота', value: '0'},
      {text: 'Широта', value: '1'},
      {text: 'Имя', value: 'name'},
    ],
  }),
  computed: {
    ...mapState({
      isLogin: state => state.auth.isLogin,
      isPointsActive: state => state.notification.listNotificationPointsActive,
      infoPoints: state => state.notification.infoPoints
    }),
    dataTableOptions () {
        return {
          itemsPerPage: this.isMobile ? 1 : 5,
        }
    },
    properties() {
      return this.infoPoints.features?.map(({properties, geometry: {coordinates}}) => {
        return {
          ...coordinates,
          ...properties
        }
      })
    }
  },
  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  beforeDestroy () {
    if (typeof window === 'undefined') return

    window.removeEventListener('resize', this.onResize, { passive: true })
  },
  methods: {
    ...mapActions({
      getData: 'get_info_points'
    }),
    onResize(){

      this.isMobile = window.innerWidth <= 600
    }
  },
}
</script>