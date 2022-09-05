<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    hide-overlay
  >
    <template #activator="{ on }">
      <v-btn icon title="Войти" v-on="on">
        <v-icon>
          mdi-login
        </v-icon>
      </v-btn>
    </template>

    <v-tabs>
      <v-tabs-slider />
      <!--   Вход   -->
      <v-tab
        :key="1"
        :href="`#tab-1`"
      >
        Вход
      </v-tab>
      <!--   Регистрация   -->
      <v-tab
        :key="2"
        :href="`#tab-2`"
      >
        Регистрация
      </v-tab>

      <v-spacer />
      <v-btn
        icon
        class="mr-2 mt-2"
        @click="dialog=false"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>

      <!--   Вход   -->
      <v-tab-item
        :key="1"
        :value="'tab-1'"
      >
        <login />
      </v-tab-item>
      <!--   Регистрация   -->
      <v-tab-item
        :key="2"
        :value="'tab-2'"
      >
        <register />
      </v-tab-item>
    </v-tabs>
    <v-spacer />
  </v-dialog>
</template>

<script>
  import Register from "@/components/AuthRegister"
  import Login from "@/components/AuthLogin";
  import {mapState} from "vuex";

  export default {
    name: "Auth",
    components: {Login, Register},
    data: () => ({
      dialog: false
    }),
    computed: {
      ...mapState({
        isLogin: state => state.auth.isLogin
      })
    },
    watch: {
      isLogin(newValue) {
        if(newValue) {
          this.dialog = !newValue;
        }
      }
    },
  }
</script>

<style scoped>

</style>