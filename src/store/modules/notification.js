import notificationApi from "@/api/notification";

export default {
  state: {
    infoPoints: [],
    listNotificationPointsActive: false,
    selectedPoint: null,
  },
  mutations: {
    SET_POINTS(state, data) {
      state.infoPoints = data;
    },
    SET_INFO_POINTS_VISIBILITY(state, data) {
      state.listNotificationPointsActive = data;
    },
    SET_SELECTED_POINT(state, data) {
      state.selectedPoint = data;
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
