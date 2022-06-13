import notificationApi from "@/api/notification";

export default {
  state: {
    infoPoints: null,
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
    get_info_points({ state, commit }, force = false) {
      if (force) {
        notificationApi.listPoints().then(({ data }) => {
          commit("SET_POINTS", data);
        });
        return;
      }

      if (!state.infoPoints) {
        notificationApi.listPoints().then(({ data: features }) => {
          commit("SET_POINTS", features);
        });
      }
    },
  },
};
