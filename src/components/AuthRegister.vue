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
                label="Ваш логин для входа"
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
            v-model="firstName"
            :error-messages="firstNameErrors"
            label="Имя"
            @input="$v.firstName.$touch()"
            @blur="$v.firstName.$touch()"
          />
          <v-text-field
            v-model="lastName"
            :error-messages="lastNameErrors"
            label="Фамилия"
            @input="$v.lastName.$touch()"
            @blur="$v.lastName.$touch()"
          />
          <v-text-field
            v-model="tLogin"
            :error-messages="tLoginErrors"
            label="Ник в телеграме"
            @input="$v.tLogin.$touch()"
            @blur="$v.tLogin.$touch()"
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
  import { mapActions } from "vuex";


  export default {
    name: "Register",
    mixins: [validationMixin],

    validations: {
      username: { required, maxLength: maxLength(10) },
      password: { required },
      tLogin: { maxLength: maxLength(10), required },
      firstName: { required },
      lastName: { required },
    },

    data: () => ({
      username: '',
      password: '',
      tLogin: '',
      showPass: false,
      firstName: '',
      lastName: ''
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
      },
      tLoginErrors () {
        const errors = []
        !this.$v.tLogin.maxLength && errors.push('Name must be at most 10 characters long')
        return errors
      },
      firstNameErrors () {
        const errors = []
        if (!this.$v.firstName.$dirty) return errors
        !this.$v.firstName.required && errors.push('First name is required.')
        return errors
      },
      lastNameErrors () {
        const errors = []
        if (!this.$v.lastName.$dirty) return errors
        !this.$v.lastName.required && errors.push('Last name is required.')
        return errors
      },
    },

    methods: {
      ...mapActions({register: 'register'}),
      submit () {
        this.$v.$touch();
        this.register({
          username: this.username,
          password: this.password,
          telegram_login: this.tLogin,
          first_name: this.firstName,
          last_name: this.lastName,
        })
      },
      clear () {
        this.username = '';
        this.password = '';
        this.tLogin = '';
        this.firstName = '';
        this.lastName = '';
      },
    },
  }
</script>