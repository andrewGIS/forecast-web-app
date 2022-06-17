<template>
  <v-data-table
    v-if="isLogin && isPointsActive"
    color="white"
    :headers="headers"
    :items="properties"
    :options="dataTableOptions"
    @click:row="selectRow"
  >
    <template #top>
      <v-toolbar
        flat
      >
        <v-snackbar
          v-model="snackbar"
          absolute
          top
          timeout="1500"
        >
          <template #action="{ attrs }">
            <v-btn
              icon
              text
              v-bind="attrs"
              @click="snackbar = false"
            >
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </template>
          Кликните на карте для добавления точки
        </v-snackbar>
        <v-btn
          v-if="!isAddingPointActive"
          color="primary"
          dark
          class="mb-2"
          @click="onAddClick"
        >
          Добавить точку
        </v-btn>
        <v-btn
          v-if="isAddingPointActive"
          color="primary"
          dark
          class="mb-2"
          @click="onCancelClick"
        >
          Отмена
        </v-btn>
        <v-spacer />
        <v-btn
          icon
          title="Обновить таблицу"
          @click="getData(true)"
        >
          <v-icon>
            mdi-refresh
          </v-icon>
        </v-btn>
      </v-toolbar>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon @click.stop="onDelete(item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
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
      {text: '', value: 'actions', sortable: false },
    ],
    snackbar: false,
    isAddingPointActive: false
  }),
  computed: {
    ...mapState({
      isLogin: state => state.auth.isLogin,
      isPointsActive: state => state.notification.listNotificationPointsActive,
      infoPoints: state => state.notification.infoPoints,
      gMap: state => state.gMap
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
  watch: {
    // Если закрыли, а отмену не нажали
    isPointsActive (newValue) {
      if (!newValue) {
        this.onCancelClick()
        this.setClickedPoint(null)
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
      getData: 'get_info_points',
      deletePoint: 'delete_point'
    }),
    ...mapMutations([]),
    ...mapMutations({
      setSelectedPoint: 'SET_SELECTED_POINT',
      setClickedPoint: 'SET_CLICKED_POINT',
      setOrderDialogState: 'SET_ORDER_DIALOG_STATE',

    }),
    clickHandler(e){
      this.setClickedPoint(e.latlng);
      this.setOrderDialogState(true);
    },
    onAddClick(){
      this.snackbar = true;
      this.isAddingPointActive = true;
      this.gMap.on('click', this.clickHandler)
    },
    onCancelClick() {
      this.isAddingPointActive = false;
      this.gMap.off('click', this.clickHandler)
    },
    onResize(){
      this.isMobile = window.innerWidth <= 600
    },
    selectRow(row) {
      this.setSelectedPoint(row)
    },
    onDelete(row) {
      this.deletePoint(row.id)
      this.getData(true)
    }
  },
}
</script>