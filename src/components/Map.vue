<template>
  <l-map ref="map">
    <risk-layer />
    <l-tile-layer :url="osmURL"></l-tile-layer>

    <!-- <Legend/>
          <Options/>
          <date-picker/> -->
    <Alert />
    <l-tiff/>
  </l-map>
</template>

<script>
import { LMap, LTileLayer } from "vue2-leaflet";
// import Legend from './Legend.vue'
// import DatePicker from './DatePicker.vue'
import Alert from "./Alert.vue";
import RiskLayer from "./RiskLayer";
import LTiff from "./LTiff.vue"

export default {
  name: "Map",

  data: () => ({
    osmURL: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    map: null
  }),
  components: {
    LMap,
    LTileLayer,
    // Legend,
    // Options,
    // DatePicker,
    Alert,
    RiskLayer,
    LTiff
  },
  methods:{
    getImagePart() {
      // Stream reading was stolen from official WEB api docs
      return fetch(
        `${process.env.VUE_APP_API_BASE}/get_index`
      )
        .then(response => response.body)
        .then(rb => {
          const reader = rb.getReader();

          return new ReadableStream({
            start(controller) {
              // The following function handles each data chunk
              function push() {
                // "done" is a Boolean and value a "Uint8Array"
                reader.read().then(({ done, value }) => {
                  // If there is no more data to read
                  if (done) {
                    // console.log("done", done);
                    controller.close();
                    return;
                  }
                  // Get the data and send it to the browser via the controller
                  controller.enqueue(value);
                  // Check chunks by logging to the console
                  //console.log(done, value);
                  push();
                });
              }

              push();
            }
          });
        })
        .then(stream => {
          // Respond with our stream
          return new Response(stream, {
            headers: { "Content-Type": "image/tif" }
          }).blob();
        })
        .then(result => {
          // Do things with result
          //console.log(result);
          return URL.createObjectURL(result);
        })
        .catch(() => {
          return;
        });
    },
  },
};
</script>
