<!--TODO сделать верстку контролов на маленьком экране-->
<template>
  <div class="d-inline-flex ">
    <list-points v-if="isLogin" />
    <order-notification v-if="isLogin" />
    <auth v-if="!isLogin" />
    <logout v-if="isLogin" />
  </div>
</template>

<script>
import Auth from "@/components/Auth";
import OrderNotification from "@/components/ControlsOrderNotification";
import Logout from "@/components/ControlsLogout";
import {mapState} from "vuex";
import ListPoints from "@/components/ControlsListPoints";

export default {
  name: 'Controls',

  components: {
    ListPoints,
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