<script>
import L from "leaflet";
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import * as parse_georaster from 'georaster';
import chroma from 'chroma-js';
import geoblaze from 'geoblaze';

import {mapGetters, mapMutations, mapState} from "vuex";
import forecastApi from "@/api/forecast";

export default {
  name: "LTiff",
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    infoPopup: {
      type: Boolean,
      required: true
    }, 
    typeRaster: {
      type: String,
      required: true,
      validator(value) {
        return ['index', 'raster'].includes(value)
      }
    }
  },
  data: () => ({
    layer: null,
    rasterData: null,
    opacity: 0.5,
    popup: null
  }),
  computed: {
    ...mapState([
      "selectedModel",
      "indexColor",
      "riskColor",
      "selectedIndex",
      "selectedDate"
    ]),
    ...mapGetters(["SELECTED_HOUR", "SELECTED_DATE"]),
    rasterDataMin() {
      if (!this.rasterData) return 0;
      return this.rasterData.mins[0];
    },
    rasterDataMax () {
      if (!this.rasterData) return 0;
      return this.rasterData.maxs[0];
    },
  },
  watch: {
    isVisible(newValue) {
      if (newValue) {
        if (!this.layer) {
          this.createLayer();
        } else {
          this.layer.setOpacity(this.opacity);
        }
      } else {
        this.layer.setOpacity(0.0);
        if (this.popup) {
          this.popup.remove();
        }
      }
    },
    async selectedIndex() {
      if (!this.isVisible) return;
      if (this.layer) this.layer.remove();
      await this.createLayer();
    },
    async selectedDate() {
      if (!this.isVisible) return;
      if (this.layer) this.layer.remove();
      await this.createLayer();
    }
  },
  beforeMount() {
    this.parentContainer = this.findRealParent(this.$parent);
    this.map = this.parentContainer.mapObject;
  },
  mounted() {
    if(this.infoPopup) {
      this.popup = new L.popup();
      this.map.on('click', this.displayPopup);
    }
  },
  methods: {
    ...mapMutations({
      setIndexRange: "SET_INDEX_RANGE"
    }),
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
    displayPopup(e) {
      if (!this.isVisible) {
        return;
      }
      const latlng = [e.latlng.lng, e.latlng.lat];
      const value = geoblaze.identify(this.rasterData, latlng);
      if (value === null || Number.isNaN(value)) {
        this.popup.remove();
        return;
      }

      this.popup.setLatLng(e.latlng).openOn(this.map);
      this.popup.setContent(
        `Значение растра в точке: ${parseFloat(value).toFixed(2)}`
      );
    },
    async createLayer() {

      const params = {
        model: this.selectedModel,
        date: this.SELECTED_DATE,
        hour: this.SELECTED_HOUR,
        index_name: this.selectedIndex,
      }

      await forecastApi.get_index_raster(params)
          .then(response => response.data)
          .then(arrayBuffer => {
            parse_georaster(arrayBuffer).then(raster => {
              this.rasterData = raster;
              this.setIndexRange([
                  this.rasterData.mins[0],
                  this.rasterData.maxs[0]
              ])
              this.layer = new GeoRasterLayer({
                georaster: this.rasterData,
                opacity: this.opacity,
                pixelValuesToColorFn: values => {
                  return this.getColorFromValues(values, this.rasterDataMin, this.rasterDataMax)
                }
              });
              this.layer.addTo(this.map);
            });
          });
    },
    getColorFromValues(values, min, max) {
      const band0value = values[0];
      if (band0value === 0) return null;
      const colorsPallets = {
        'index': this.indexColor,
        'raster': this.riskColor
      }
      const colorPallet = colorsPallets[this.typeRaster];
      return chroma.scale(colorPallet).domain([min, max])(band0value).hex();
    }
  },
  render() {
    return null;
  }
};
</script>