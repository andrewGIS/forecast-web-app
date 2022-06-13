<template>
  <v-data-table
    v-if="isLogin && isPointsActive"
    color="white"
    :headers="headers"
    :items="properties"
    :options="dataTableOptions"
    @click:row="selectRow"
  />
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
export default {
  data: () => ({
    isMobile: false,
    dialog: true,
    headers: [
      {text: 'ID', value: 'id'},
      {text: 'Долгота', value: 'X'},
      {text: 'Широта', value: 'Y'},
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
      if (this.infoPoints) {
        return this.infoPoints.features?.map(({properties, geometry: {coordinates}}) => {
          return {
            X:coordinates[0],
            Y:coordinates[1],
            ...properties
          }
        })
      } else {
        return []
      }
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
    ...mapMutations({
      setSelectedPoint: 'SET_SELECTED_POINT'
    }),
    onResize(){
      this.isMobile = window.innerWidth <= 600
    },
    selectRow(row) {
      this.setSelectedPoint(row)
    }
  },
}
</script>