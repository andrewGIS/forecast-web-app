import notificationApi from "@/api/notification";

export default {
  state: {
    infoPoints: null,
    listNotificationPointsActive: false,
    selectedPoint: null,
    orderDialogActive: false,
    clickedPoint: null, // точка на карте по которой кликнули для заказа оповещения
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
    SET_ORDER_DIALOG_STATE(state, data) {
      state.orderDialogActive = data;
    },
    SET_CLICKED_POINT(state, data) {
      state.clickedPoint = data;
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
    delete_point({ dispatch }, id) {
      notificationApi
        .deletePoint(id)
        .then(() => dispatch("get_info_points", true));
    },
  },
};
