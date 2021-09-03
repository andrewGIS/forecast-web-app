// TODO Load how to add layer to leaflet map when url return not picture 
// TODO Get boundary by request
<script>
import L from "leaflet";
import * as GeoTIFF from "leaflet-geotiff-2";
import "leaflet-geotiff-2/dist/leaflet-geotiff-plotty"; // requires plotty
import { mapState } from "vuex";

// from vue2leaflet src github for find leaflet map
const roptions = {
  // Optional. Minimum values to plot.
  displayMin: 1,
  // Optional. Maximum values to plot.
  displayMax: 10,
  // Optional. If true values outside `displayMin` to `displayMax` will be rendered as if they were valid values.
  clampLow: false,
  clampHigh: true,
  // Optional. Plotty color scale used to render the image.
  colorScale: "viridis"
  //colorScale: "greys"
};

const renderer = L.LeafletGeotiff.plotty(roptions);

// eslint-disable-next-line no-unused-vars
const options = {
  // See renderer sections below.
  // One of: L.LeafletGeotiff.rgb, L.LeafletGeotiff.plotty, L.LeafletGeotiff.vectorArrows
  renderer: renderer,

  // Optional array specifying the corners of the data, e.g. [[40.712216, -74.22655], [40.773941, -74.12544]].
  // If omitted the image bounds will be read from the geoTIFF file (ModelTiepoint).
  // bounds: [
  //   //[34.875, 49.875],
  //   //[75.125, 65.125]
  //   [65.125, 75.125], // upper right corner lat lon
  //   [49.875, 34.875] // bootom left corner lat lon
  // ],

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

export default {
  data: () => ({
    layer: null,
    //TODO Request from server
    modelsBounds: {
      gfs: [
        [65.125, 75.125],
        [49.875, 34.875]
      ], // upper rught bootom left corner lat lon
      icon: [
        [65.0625, 74.9375],
        [50.0625, 34.9375]
      ]
    }
  }),
  props: {
    url: {
      type: String,
      required: true
    },
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  name: "LTiff",
  async mounted() {
    //let layer;
    try {
      //let blob = await this.getTiff();
      let layer = L.leafletGeotiff([], this.options);
      //let layer = L.leafletGeotiff()
      this.mapObject = layer;
      this.parentContainer = this.findRealParent(this.$parent);
      layer.setOpacity(0.5);
      layer.addTo(this.parentContainer.mapObject, !this.isVisible);
      this.layer = layer;
    } catch (error) {
      console.log(error);
    }

    // for show identification result in popu window
    //let popup;
    this.parentContainer.mapObject.on("click", e => {
      console.log(this.layer.getValueAtLatLng(+e.latlng.lat, +e.latlng.lng));

      // sample for identification from GeoTiff
      // if (!popup) {
      //   popup = L.popup()
      //     .setLatLng([e.latlng.lat, e.latlng.lng])
      //     .openOn(this.map);
      // } else {
      //   popup.setLatLng([e.latlng.lat, e.latlng.lng]);
      // }
      // const value = layer.getValueAtLatLng(+e.latlng.lat, +e.latlng.lng);
      // popup
      //   .setContent(`Possible value at point (experimental/buggy): ${value}`)
      //   .openOn(this.parentContainer.mapObject);
    });
  },
  render() {
    return null;
  },
  computed: {
    ...mapState(["selectedModel"]),
    options () {
      return {
        renderer: renderer,
        bounds: this.bbox,
        band: 0,
        image: 0,
        clip: undefined,
        pane: "overlayPane",
        onError: null,
        sourceFunction: GeoTIFF.fromBlob,
        arrayBuffer: null,
        noDataValue: undefined,
        noDataKey: undefined,
        opacity: 1
      }
    },
    bbox() {
      if (this.selectedModel) {
        return this.modelsBounds[this.selectedModel];
      }
      return null;
    }
  },
  methods: {
    // from other project and MSDN
    getTiff() {
      // Stream reading was stolen from official WEB api docs
      return fetch(this.url)
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
    findRealParent(firstVueParent) {
      let found = false;
      while (firstVueParent && !found) {
        if (firstVueParent.mapObject === undefined) {
          firstVueParent = firstVueParent.$parent;
        } else {
          found = true;
        }
      }
      return firstVueParent;
    }
  },
  watch: {
    async url() {
      if (this.layer) {
        this.layer.setURL(this.url);
      }
    }
  }
};
</script>

<style>
</style>