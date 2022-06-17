<template>
  <v-dialog 
    v-if="isLogin"
    :value="dialog"
    max-width="600px"
    hide-overlay
    :style="{zIndex: 1003}"
    persistent
    no-click-animation
  >
    <template #activator="{ on }">
      <v-btn
        icon
        title="Добавить точку оповещения"
        v-on="on"
        @click="SET_ORDER_DIALOG_STATE(!dialog)"
      >
        <v-icon>
          mdi-clipboard-list-outline
        </v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span>Заказать оповещение для точки (в радиусе 20 км)</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="pointName"
                label="Название точки "
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="X"
                label="Долгота (X) 59.59"
                required
              />
            </v-col>
            
            <v-col cols="12">
              <v-text-field 
                v-model="Y"
                label="Широта (Y) 59.59"
                required
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="shiftTime"
                label="Смещение от UTC (часы)"
                required
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="SET_ORDER_DIALOG_STATE(false)"
        >
          Закрыть
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="requestNotification"
        >
          Запросить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import notificationApi from "../api/notification";
  
  export default {
    name: "OrderNotification",
    data: ()=>({
      flag: false,
      X: null,
      Y: null,
      pointName: null,
      shiftTime: null // смещение от UTC в часах
    }),
    computed: {
      ...mapState({
        clickedPoint: state => state.notification.clickedPoint,
        dialog: state => state.notification.orderDialogActive,
        isLogin: state => state.auth.isLogin
      })
    },
    watch:{
      dialog(){
        this.shiftTime = new Date().getTimezoneOffset() / 60
      },
      clickedPoint(newValue) {
        this.X = newValue?.lng.toFixed(4)
        this.Y = newValue?.lat.toFixed(4)
      }
    },
    methods:{
      ...mapActions(['get_info_points']),
      ...mapMutations(['SET_ORDER_DIALOG_STATE']),
      requestNotification(){
        notificationApi.order({
          X: this.X,
          Y: this.Y,
          name: this.pointName,
          pointFromUTCOffset:this.shiftTime
        }).then(() => {
          this.SET_ORDER_DIALOG_STATE(false)
          this.get_info_points(true)
        })
      }
    }
  }
</script>

<style scoped>

</style>