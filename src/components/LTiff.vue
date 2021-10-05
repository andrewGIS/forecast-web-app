<script>
// TODO Load how to add layer to leaflet map when url return not picture
// TODO Get boundary by request
import L from "leaflet";
import * as GeoTIFF from "leaflet-geotiff-2";
import "leaflet-geotiff-2/dist/leaflet-geotiff-plotty"; // requires plotty
import { mapState } from "vuex";

// from vue2leaflet src github for find leaflet map
const roptions = {
  // Optional. Minimum values to plot.
  displayMin: 1,
  // Optional. Maximum values to plot.
  displayMax: 1000,
  // Optional. If true values outside `displayMin` to `displayMax` will be rendered as if they were valid values.
  clampLow: false,
  clampHigh: true,
  // Optional. Plotty color scale used to render the image.
  colorScale: "viridis"
  //colorScale: "greys"
};

// eslint-disable-next-line no-unused-vars
const renderer = L.LeafletGeotiff.plotty(roptions);
//const options = L.LeafletGeotiff.plotty()

// eslint-disable-next-line no-unused-vars
// const options = {
//   // See renderer sections below.
//   // One of: L.LeafletGeotiff.rgb, L.LeafletGeotiff.plotty, L.LeafletGeotiff.vectorArrows
//   renderer: renderer,

//   // Optional array specifying the corners of the data, e.g. [[40.712216, -74.22655], [40.773941, -74.12544]].
//   // If omitted the image bounds will be read from the geoTIFF file (ModelTiepoint).
//   // bounds: [
//   //   //[34.875, 49.875],
//   //   //[75.125, 65.125]
//   //   [65.125, 75.125], // upper right corner lat lon
//   //   [49.875, 34.875] // bootom left corner lat lon
//   // ],

//   // Optional geoTIFF band to read
//   band: 0,

//   // Optional geoTIFF image to read
//   image: 0,

//   // Optional clipping polygon, provided as an array of [lat,lon] coordinates.
//   // Note that this is the Leaflet [lat,lon] convention, not geoJSON [lon,lat].
//   clip: undefined,

//   // Optional leaflet pane to add the layer.
//   pane: "overlayPane",

//   // Optional callback to handle failed URL request or parsing of tif
//   onError: null,

//   // Optional, override default GeoTIFF function used to load source data
//   // Oneof: fromUrl, fromBlob, fromArrayBuffer
//   // eslint-disable-next-line no-undef
//   sourceFunction: GeoTIFF.fromBlob,

//   // Only required if sourceFunction is GeoTIFF.fromArrayBuffer
//   arrayBuffer: null,

//   // Optional nodata value (integer)
//   // (to be ignored by getValueAtLatLng)
//   noDataValue: undefined,

//   // Optional key to extract nodata value from GeoTIFFImage
//   // nested keys can be provided in dot notation, e.g. foo.bar.baz
//   // (to be ignored by getValueAtLatLng)
//   // this overrides noDataValue, the nodata value should be an integer
//   noDataKey: undefined,

//   // The block size to use for buffer
//   //blockSize: 65536,

//   // Optional, override default opacity of 1 on the image added to the map
//   opacity: 1
// };

export default {
  name: "LTiff",
  props: {
    url: {
      type: String,
      required: true
    },
    isVisible: {
      type: Boolean,
      required: true
    },
    infoPopup: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    // roptions: {
    //   // Optional. Minimum values to plot.
    //   displayMin: 1,
    //   // Optional. Maximum values to plot.
    //   displayMax: 1000,
    //   // Optional. If true values outside `displayMin` to `displayMax` will be rendered as if they were valid values.
    //   clampLow: false,
    //   clampHigh: true,
    //   // Optional. Plotty color scale used to render the image.
    //   colorScale: "viridis"
    //   //colorScale: "greys"
    // },
    // renderer: L.LeafletGeotiff.plotty({
    //   // Optional. Minimum values to plot.
    //   displayMin: 1,
    //   // Optional. Maximum values to plot.
    //   displayMax: 10,
    //   // Optional. If true values outside `displayMin` to `displayMax` will be rendered as if they were valid values.
    //   clampLow: false,
    //   clampHigh: true,
    //   // Optional. Plotty color scale used to render the image.
    //   colorScale: "viridis"
    //   //colorScale: "greys"
    // }),
    renderer: L.LeafletGeotiff.plotty({
      clampLow: false,
      clampHigh: true,
      colorScale: "viridis"
    }),
    layer: null,
    //TODO Request from server
    // upper rught bootom left corner lat lon
    modelsBounds: {
      gfs: [
        [65.125, 75.125],
        [49.875, 34.875]
      ],
      icon: [
        [65.0625, 74.9375],
        [50.0625, 34.9375]
      ]
    },
    map: null
  }),
  computed: {
    ...mapState(["selectedModel"]),
    // renderer(){
    //   //let options = L.leafletGeotiff.plotty()
    //   return options
    // },
    options() {
      return {
        renderer: this.renderer,
        bounds: this.bbox,
        band: 0,
        image: 0,
        clip: undefined,
        pane: "overlayPane",
        onError: () => {},
        sourceFunction: GeoTIFF.fromUrl,
        arrayBuffer: null,
        noDataValue: 0,
        noDataKey: undefined,
        opacity: 1,
        popup: null
        // The block size to use for buffer
      };
    },
    bbox() {
      if (this.selectedModel) {
        return this.modelsBounds[this.selectedModel];
      }
      return null;
    }
  },
  watch: {
    url() {
      if (this.layer) {
        //this.map.removeLayer(this.layer)
        //this.renderer.options.displayMax = 10;
        //this.renderer.options.displayMin = 0;
        //this.renderer.setDisplayRange({min: 0, max: 10})
        //this.createTiffLayer();
        this.layer.setURL(this.url);
        console.log(this.layer);
        console.log(Math.max(...this.layer.raster.data[0]), Math.min(...this.layer.raster.data[0]))
        this.layer.options.renderer.options.displayMax = Number.parseInt(Math.max(...this.layer.raster.data[0]));
        this.layer.options.renderer.options.displayMin = Number.parseInt(Math.min(...this.layer.raster.data[0]));
        //this.map.addLayer(this.layer);
        console.log(this.layer);
        
      }
    },
    selectedModel() {
      this.map.removeLayer(this.layer);
      this.createTiffLayer();
    },
    isVisible(){
      if(!this.isVisible) {
        this.map.removeLayer(this.layer);
        this.popup.remove();
        this.map.off('mousemove', this.dispalyPopup);
      } else {
        this.createTiffLayer();
        this.map.on("mousemove", this.dispalyPopup);
      }
    },
    // TODO протестить 
    infoPopup(){
      if(!this.infoPopup) {
        this.popup.remove();
        this.map.off('mousemove', this.dispalyPopup);
      } else {
        this.popup = L.popup();
        this.map.on("mousemove", this.dispalyPopup);
      }
    }
  },
  mounted() {
    try {
      this.createTiffLayer();
      this.parentContainer = this.findRealParent(this.$parent);
      this.map = this.parentContainer.mapObject;
    } catch (error) {
      console.log(error);
    }

    this.popup = L.popup();

    // for show identification result in popu window
    // TODO check when props change
    this.map.on("mousemove", this.dispalyPopup);
  },
  methods: {
    dispalyPopup(e) {

      if(!this.isVisible) {
        return 
      }
      //sample for identification from GeoTiff
      const value = this.layer.getValueAtLatLng(+e.latlng.lat, +e.latlng.lng);
      if (value === null || value === undefined) {
        //this.popup.closePopup();
        this.popup.remove();
        return
      }

      this.popup
        .setLatLng([e.latlng.lat, e.latlng.lng])
        .openOn(this.map);
      
      this.popup
        .setContent(`Значение растра в точке: ${value}`)
        //.openOn(this.parentContainer.mapObject);
    },
    // from other project and MSDN
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
    },
    async createTiffLayer() {
      let layer = await L.leafletGeotiff(this.url, this.options);
      //this.layer._zoomAnimated = false;
      //delete this.layer.__animateZoom;
      this.mapObject = layer;
      layer.setOpacity(0.5);
      this.layer = layer;
      if(this.isVisible){
        this.layer.addTo(this.map, this.isVisible);
      }
      
    }
  },
  render() {
    return null;
  }
};
</script>