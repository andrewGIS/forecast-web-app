<template>
  <v-card>
    <v-card-text>
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="username"
                :error-messages="usernameErrors"
                :counter="10"
                label="Логин для входа"
                required
                @input="$v.username.$touch()"
                @blur="$v.username.$touch()"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="password"
            :error-messages="passErrors"
            :type="showPass ? 'text' : 'password'"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            label="Пароль"
            required
            @input="$v.password.$touch()"
            @blur="$v.password.$touch()"
            @click:append="showPass = !showPass"
          />
          <v-text-field
            v-model="tLogin"
            label="Ник в телеграме"
            @input="$v.tLgoin.$touch()"
            @blur="$v.tLgoin.$touch()"
          />
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="blue darken-1"
        text
        @click="clear"
      >
        Очистить форму
      </v-btn>
      <v-btn
        color="blue darken-1"
        text
        @click="submit"
      >
        Зарегистрироваться
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, maxLength } from 'vuelidate/lib/validators'

  export default {
    name: "Register",
    mixins: [validationMixin],

    validations: {
      username: { required, maxLength: maxLength(10) },
      password: {required},
      tLogin: {required}
    },

    data: () => ({
      username: '',
      password: '',
      tLogin: '',
      showPass: false
    }),

    computed: {
      passErrors(){
        const errors = []
        if (!this.$v.password.$dirty) return errors
        return errors
        },
      usernameErrors () {
        const errors = []
        if (!this.$v.username.$dirty) return errors
        !this.$v.username.maxLength && errors.push('Name must be at most 10 characters long')
        !this.$v.username.required && errors.push('Name is required.')
        return errors
      }
    },

    methods: {
      submit () {
        this.$v.$touch();
      },
      clear () {
        this.username = '';
        this.password = '';
        this.tLogin = '';
      },
    },
  }
</script>