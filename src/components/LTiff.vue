<script>
// TODO Load how to add layer to leaflet map when url return not picture
// TODO Get boundary by request

// FIXME color map after first load
import L from "leaflet";
import { mapState } from "vuex";

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
    layer: null,
    rasterData: null,
    opacity: 0.5,
    popup: null
    //TODO Request from server
    // upper rught bootom left corner lat lon
  }),
  computed: {
    ...mapState(["selectedModel"]),
    // max () {
    //   if (!this.layer) return 1000
    //   return Number.parseInt(Math.max(...this.layer.raster.data[0]));
    // },
    // min() {
    //   if (!this.layer) return null
    //   return Number.parseInt(Math.min(...this.layer.raster.data[0]));
    // },
    // options() {
    //   return {
    //     renderer: this.renderer,
    //     bounds: this.bbox,
    //     band: 0,
    //     image: 0,
    //     pane: "overlayPane",
    //     onError: () => {},
    //     sourceFunction: GeoTIFF.fromUrl,
    //     noDataValue: 0
    //   };
  },
  watch: {
    url() {
      if (!this.rasterData) {
        // Когда добавляем первый раз
        console.log(this.url);
        // eslint-disable-next-line no-undef
        d3.request(
          //"http://localhost:5000/api/v1/get_index?model=gfs&date=20210721&forecast_type=00&hour=03&index_name=cape_255-0"
          this.url
        )
          .responseType("arraybuffer")
          .get((error, tiffData) => {
            this.rasterData = L.ScalarField.fromGeoTIFF(tiffData.response);

            this.layer = L.canvasLayer
              .scalarField(this.rasterData, {
                // eslint-disable-next-line no-undef
                color: chroma
                  .scale(["yellow", "008ae5"])
                  .domain(this.rasterData.range || [0, 0])
                  .classes(8),
                opacity: 0.0
              })
              .addTo(this.map);

            if (this.infoPopup) {
              this.popup = L.popup();
              this.layer.on("mousemove", e => {
                this.dispalyPopup(e);
              });
            }
          });
      } else {
        // eslint-disable-next-line no-undef
        d3.request(this.url)
          .responseType("arraybuffer")
          .get((error, tiffData) => {
            
            this.rasterData = L.ScalarField.fromGeoTIFF(tiffData.response);
            this.layer.setData(this.rasterData);
            // eslint-disable-next-line no-undef
            this.layer.setColor(chroma
                  .scale(["yellow", "008ae5"])
                  .domain(this.rasterData.range || [0, 0])
                  .classes(8))
            //console.log(this.layer.getData()._calculateRange());
            // eslint-disable-next-line no-undef
            // this.layer.setColor(
            //   // eslint-disable-next-line no-undef
            //   chroma
            //     .scale(["yellow", "008ae5"])
            //     .domain(this.rasterData.range || [0, 0])
            //     .classes(8)
            // );
          });
      }
    },
    isVisible() {
      if (!this.layer) return;

      if (this.isVisible) {
        this.layer.setOpacity(this.opacity);
      } else {
        this.layer.setOpacity(0.0);
        if (this.popup) {
          this.popup.remove();
        }
      }
    }
  },
  beforeMount() {
    this.parentContainer = this.findRealParent(this.$parent);
    this.map = this.parentContainer.mapObject;

    // Получилось подключить бибилотеку только через загрузку скрипта,
    // а зависимости как ссылки в html (geotiff, d3, chroma)
    const script = document.createElement("script");
    script.src =
      "https://ihcantabria.github.io/Leaflet.CanvasLayer.Field/dist/leaflet.canvaslayer.field.js";
    script.async = true;
    document.body.appendChild(script);
  },
  methods: {
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
    dispalyPopup(e) {
      if (!this.isVisible) {
        return;
      }
      const value = e.value;

      if (value === null || value === undefined) {
        this.popup.remove();
        return;
      }

      this.popup.setLatLng([e.latlng.lat, e.latlng.lng]).openOn(this.map);

      this.popup.setContent(
        `Значение растра в точке: ${parseFloat(value).toFixed(2)}`
      );
    }
  },
  render() {
    return null;
  }
};
</script>