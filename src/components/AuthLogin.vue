<template>
  <v-card>
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
              required
              :type="showPass ? 'text' : 'password'"
              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPass = !showPass"
            />
          </v-col>
        </v-row>
      </v-container>
      <small>*означает необходимые поля</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="blue darken-1"
        text
        @click="login({username, password})"
      >
        Войти
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "Login",
  data: ()=>({
    username: null,
    password: null,
    showPass: false
  }),
  methods:{
    ...mapActions({login: 'login'})
  }
}
</script>