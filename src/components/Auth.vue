<template>
  <v-dialog 
    v-model="dialog"
    max-width="600px"
    hide-overlay
  >
    <template #activator="{ on }">
      <v-btn
        icon
        v-on="on"
      >
        <v-icon>
          mdi-login
        </v-icon>
      </v-btn>
    </template>
      
    <v-card>
      <v-card-title>
        <span class="text-h5">Войти</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field 
                v-model="username"
                label="Логин*"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                label="Пароль*"
                type="password"
                required
              />
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
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
          @click="login({username, password})"
        >
          Войти
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapActions} from "vuex"

  export default {
    name: "Auth",
    data: ()=>({
      dialog: false,
      username: null,
      password: null
    }),
    methods:{
      ...mapActions({login: 'login'}),
      auth () {
        const baseUrl = `${process.env.VUE_APP_API_BASE}/auth/token`
        fetch(baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username ,
            password: this.password
          }),
        })
        .then(res=>res.json())
        .then(d => d.access ? alert('Success') : Promise.reject('Error auth'))
        .catch(()=>alert('Error'))
      }
    }
  }
</script>

<style scoped>

</style>