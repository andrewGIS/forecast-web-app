<template>
  <l-map ref="map">
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
// import Options from './Options.vue'
// import DatePicker from './DatePicker.vue'
import Alert from "./Alert.vue";
import L from "leaflet";
import "leaflet-geotiff-2";
import "leaflet-geotiff-2/dist/leaflet-geotiff-plotty"; // requires plotty

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
    Alert
  },
  mounted() {
    this.$nextTick(() => {
      this.map = this.$refs.map.mapObject; // work as expected

      const roptions = {
        // Optional. Minimum values to plot.
        displayMin: 0,
        // Optional. Maximum values to plot.
        displayMax: 1,
        // Optional. If true values outside `displayMin` to `displayMax` will be rendered as if they were valid values.
        clampLow: true,
        clampHigh: true,
        // Optional. Plotty color scale used to render the image.
        colorScale: "viridis"
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
        //sourceFunction: GeoTIFF.fromUrl,

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
        blockSize: 65536,

        // Optional, override default opacity of 1 on the image added to the map
        opacity: 1
      };
      // let url = process.env.BASE_URL;
      // eslint-disable-next-line no-unused-vars
      var layer = L.leafletGeotiff(
        `http://localhost:8080/temp/gfs.2021051512.003.cape_surface.tif`,
        options
      ).addTo(this.map);

      let popup;
      this.map.on("click", (e) =>{
        if (!popup) {
          popup = L.popup()
            .setLatLng([e.latlng.lat, e.latlng.lng])
            .openOn(this.map);
        } else {
          popup.setLatLng([e.latlng.lat, e.latlng.lng]);
        }
        console.log(e)
        const value = layer.getValueAtLatLng(
          +e.latlng.lat,
          +e.latlng.lng
        );
        popup
          .setContent(`Possible value at point (experimental/buggy): ${value}`)
          .openOn(this.map);
      });

    });
  }
};
</script>
