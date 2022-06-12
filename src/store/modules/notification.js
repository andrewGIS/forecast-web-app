import notificationApi from "@/api/notification";

export default {
  state: {
    infoPoints: [],
    listNotificationPointsActive: false,
  },
  mutations: {
    SET_POINTS(state, data) {
      state.infoPoints = data;
    },
    SET_INFO_POINTS_VISIBILITY(state, data) {
      state.listNotificationPointsActive = data;
    },
  },
  actions: {
    get_info_points({ commit }) {
      notificationApi.listPoints().then(({ data }) => {
        commit("SET_POINTS", data);
      });
    },
  },
};
