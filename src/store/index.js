import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import notification from "./modules/notification";
import { mapDataModule } from "./modules/forecast_data";

Vue.use(Vuex);

export default new Vuex.Store({
  // TODO пришлось так распаковать, чтобы нигде точные пути до модуля не менять
  ...mapDataModule,
  modules: {
    auth,
    notification,
  },
});
