import authApi from "../../api/auth";

// TODO туповато переделать
export default {
  state: {
    status: "not success",
    token: localStorage.getItem("token") || "",
    isLogin: false,
  },
  mutations: {
    auth_request(state) {
      state.status = "loading";
    },
    auth_success(state, { access, refresh }) {
      state.isLogin = true;
      state.status = "success";
      access && localStorage.setItem("token", access);
      refresh && localStorage.setItem("refresh", refresh);
    },
    auth_error(state) {
      state.status = "error";
      state.isLogin = false;
    },
    logout(state) {
      state.isLogin = false;
      state.status = "unauthorized";
      state.token = "";
    },
    deleteToken() {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
    },
  },
  actions: {
    // TODO отрефакторить чтобы then не повторялись
    login({ commit }, data) {
      commit("auth_request");
      authApi
        .login(data)
        .then((resp) => resp.data)
        .then(({ access, refresh }) => {
          commit("auth_success", { access, refresh });
        })
        .catch((error) => {
          console.log(error);
          commit("auth_error");
          commit("deleteToken");
        });
    },
    register({ commit }, data) {
      authApi
        .register(data)
        .then((resp) => resp.data)
        .then(({ access, refresh }) => {
          commit("auth_success", { access, refresh });
        })
        .catch((error) => {
          console.log(error);
          commit("auth_error");
          commit("deleteToken");
        });
    },
    updateToken({ commit }) {
      const refreshToken = localStorage.getItem("refresh");
      console.log();
      if (!refreshToken) {
        commit("logout");
        return;
      }
      authApi
        .refresh(refreshToken)
        .then((resp) => resp.data)
        .then(({ access }) => {
          localStorage.setItem("token", access);
          commit("auth_success", { access });
        })
        .catch((error) => {
          commit("auth_error");
          console.log(error);
        });
    },
  },
};
