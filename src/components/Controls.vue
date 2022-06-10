<template>
  <section>
    <order-notification v-if="isLogin" />
    <auth v-if="!isLogin" />
    <logout v-if="isLogin" />
  </section>
</template>

<script>
import Auth from "@/components/Auth";
import OrderNotification from "@/components/ControlsOrderNotification";
import Logout from "@/components/ControlsLogout";
import {mapState} from "vuex";

export default {
  name: 'Controls',

  components: {
    Logout,
    OrderNotification,
    Auth,
  },

  data: () => ({
    value: null
  }),
  computed: {
    ...mapState({
      isLogin: state => state.auth.isLogin
    })
  },
};
</script>