<template>
  <l-map ref="map">
    <risk-layer />
    <l-tile-layer :url="osmURL"></l-tile-layer>

    <!-- <Legend/>
          <Options/>
          <date-picker/> -->
    <Alert />
  </l-map>
</template>

<script>
import { LMap, LTileLayer } from "vue2-leaflet";
// import Legend from './Legend.vue'
// import DatePicker from './DatePicker.vue'
import Alert from "./Alert.vue";
import L from "leaflet";
import * as GeoTIFF from "leaflet-geotiff-2";
import "leaflet-geotiff-2/dist/leaflet-geotiff-plotty"; // requires plotty
import RiskLayer from "./RiskLayer";

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
    RiskLayer
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
  async mounted() {
    this.$nextTick(async() => {
      this.map = this.$refs.map.mapObject; // work as expected

      const roptions = {
        // Optional. Minimum values to plot.
        displayMin: 0,
        // Optional. Maximum values to plot.
        displayMax: 1024,
        // Optional. If true values outside `displayMin` to `displayMax` will be rendered as if they were valid values.
        clampLow: true,
        clampHigh: true,
        // Optional. Plotty color scale used to render the image.
        colorScale: "viridis"
        //colorScale: "greys"
      };

      const renderer = L.LeafletGeotiff.plotty(roptions);

      const options = {
        // See renderer sections below.
        // One of: L.LeafletGeotiff.rgb, L.LeafletGeotiff.plotty, L.LeafletGeotiff.vectorArrows
        renderer: renderer,

        // Optional array specifying the corners of the data, e.g. [[40.712216, -74.22655], [40.773941, -74.12544]].
        // If omitted the image bounds will be read from the geoTIFF file (ModelTiepoint).
        bounds: [
          //[34.875, 49.875],
          //[75.125, 65.125]
          [65.125, 75.125], // upper right corner lat lon
          [49.875, 34.875] // bootom left corner lat lon
        ],

        // Optional geoTIFF band to read
        band: 0,

        // Optional geoTIFF image to read
        image: 0,

        // Optional clipping polygon, provided as an array of [lat,lon] coordinates.
        // Note that this is the Leaflet [lat,lon] convention, not geoJSON [lon,lat].
        clip: undefined,

        // Optional leaflet pane to add the layer.
        pane: "overlayPane",

        // Optional callback to handle failed URL request or parsing of tif
        onError: null,

        // Optional, override default GeoTIFF function used to load source data
        // Oneof: fromUrl, fromBlob, fromArrayBuffer
        // eslint-disable-next-line no-undef
        sourceFunction: GeoTIFF.fromBlob,

        // Only required if sourceFunction is GeoTIFF.fromArrayBuffer
        arrayBuffer: null,

        // Optional nodata value (integer)
        // (to be ignored by getValueAtLatLng)
        noDataValue: undefined,

        // Optional key to extract nodata value from GeoTIFFImage
        // nested keys can be provided in dot notation, e.g. foo.bar.baz
        // (to be ignored by getValueAtLatLng)
        // this overrides noDataValue, the nodata value should be an integer
        noDataKey: undefined,

        // The block size to use for buffer
        //blockSize: 65536,

        // Optional, override default opacity of 1 on the image added to the map
        opacity: 1
      };
      // let url = process.env.BASE_URL;
      // eslint-disable-next-line no-unused-vars

      var layer;
      let blob = await this.getImagePart()
      layer = L.leafletGeotiff(
            blob,
            options
          );

      layer.addTo(this.map);

      // get by request
      // fetch(`${process.env.VUE_APP_API_BASE}/get_index`)
      //   .then(response => response.blob())
      //   .then(result => {
      //     console.log(result)
      //     layer = L.leafletGeotiff(
      //       // `http://localhost:8080/temp/gfs.2021051512.003.cape_surface.tif`,
      //       //`${process.env.VUE_APP_API_BASE}/get_index`,
      //       result,
      //       options
      //     );
      //     layer.addTo(this.map)
      //   })
      //   .catch(error => console.log("error", error));

      // sample identification
      // layer.setOpacity(0.5);
      // layer.addTo(this.map);

      // let popup;
      // this.map.on("click", e => {
      //   if (!popup) {
      //     popup = L.popup()
      //       .setLatLng([e.latlng.lat, e.latlng.lng])
      //       .openOn(this.map);
      //   } else {
      //     popup.setLatLng([e.latlng.lat, e.latlng.lng]);
      //   }
      //   const value = layer.getValueAtLatLng(+e.latlng.lat, +e.latlng.lng);
      //   popup
      //     .setContent(`Possible value at point (experimental/buggy): ${value}`)
      //     .openOn(this.map);
      // });
    });
  }
};
</script>
