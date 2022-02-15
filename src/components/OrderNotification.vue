<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    hide-overlay
    v-if="flag"
  >
    <template #activator="{ on }">
      <v-btn
        icon
        v-on="on"
      >
        <v-icon>
          mdi-clipboard-list-outline
        </v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span>Заказать оповещение для определенной точки (в радиусе 20 км)</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
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
                v-model="telegramNick"
                label="Ник в телеграме для отправки сообщений (@username)"
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
          @click="dialog = false"
        >
          Закрыть
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
        >
          Запросить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapState} from "vuex";
  
  export default {
    data: ()=>({
      flag: false,
      dialog: false,
      X: null,
      Y: null,
      telegramNick: null
    }),
    name: "OrderNotification",
    computed: {
      ...mapState({
        isAuth: state => state.auth.status
      })
    },
    watch:{
      isAuth: function (newValue) {
        if (newValue === 'success') {
          this.flag = true
        }
      }
    }
  }
</script>

<style scoped>

</style>