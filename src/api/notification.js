import client from "./index";

export default {
  order(data) {
    return client.post("informer/order", data);
  },
  listPoints() {
    return client.get("informer/list_points");
  },
};
