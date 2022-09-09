<template>
  <div>
    <v-btn icon @click="setConfigVisibility(true)">
      <v-icon size="24px">
        mdi-cog-outline
      </v-icon>
    </v-btn>

    <v-snackbar
      left
      bottom
      :value="isVisible"
      timeout="-1"
      max-width="100"
      :style="{zIndex:1002}"
    >
      <v-container fluid>
        <v-row justify="end">
          <v-btn class="mx-0" icon @click="setConfigVisibility(false)">
            <v-icon size="24px">
              mdi-close
            </v-icon>
          </v-btn>
        </v-row>

        <v-row class="pa-0">
          <v-col class="pa-0">
            Модель
          </v-col>
        </v-row>
        <v-row class="pa-0">
          <v-col cols="10" class="pa-0">
            <v-select
              v-model="selectedModel"
              :items="models"
              filled
              label="Модель"
              dense
              solo
            />
          </v-col>
          <v-col
            cols="2"
            class="pa-0"
          >
            <v-btn
              class="mx-4"
              icon
              @click="(dialog = true), (menusection = 'model')"
            >
              <v-icon size="24px">
                mdi-information
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="pa-0">
          <v-col class="pa-0">
            Группа явлений
          </v-col>
        </v-row>

        <v-row class="pa-0">
          <v-col
            cols="10"
            class="pa-0"
          >
            <v-select
              v-model="selectedEvent"
              label="Выберите группу"
              :items="eventGroups"
              item-text="alias"
              filled
              dense
              solo
              return-object
            />
          </v-col>
          <v-col
            cols="2"
            class="pa-0"
          >
            <v-btn
              class="mx-4"
              icon
              @click="(dialog = true), (menusection = 'eventgroup')"
            >
              <v-icon size="24px">
                mdi-information
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row
          class="pa-0"
          align-content="center"
          justify="space-between"
          align="baseline"
        >
          <v-row class="pa-0">
            <v-col cols="12">
              <v-radio-group
                v-model="selectedDisplayType"
              >
                <template #label>
                  <div>Способ отображения прогноза</div>
                </template>
                <!--                <v-radio-->
                <!--                  label="Растр"-->
                <!--                  value="raster"-->
                <!--                />-->
                <v-radio
                  label="Вектор"
                  value="vector"
                />
              </v-radio-group>
            </v-col>
          </v-row>
        </v-row>

        <v-row class="pa-0">
          <v-col class="pa-0">
            Индекс
          </v-col>
        </v-row>
        <v-row
          align-content="center"
          justify="space-between"
          align="baseline"
          class="pa-0"
        >
          <v-col
            cols="2"
            class="pa-0"
          >
            <v-checkbox
              :checked="indexActive"
              @change="setIndexActive(!indexActive)"
            />
          </v-col>
          <v-col
            cols="8"
            class="pa-0"
          >
            <v-select
              v-model="selectedIndex"
              max-width="400"
              :items="indexList"
              filled
              dense
              solo
              :disabled="!indexActive"
            />
          </v-col>
          <v-col
            cols="2"
            class="pa-0"
          >
            <v-btn
              class="mx-4"
              icon
              @click="(dialog = true), (menusection = 'index')"
            >
              <v-icon size="24px">
                mdi-information
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-dialog
          v-model="dialog"
          width="500"
        >
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Дополнительная информация
            </v-card-title>
            <v-card-text>
              {{ modalinfo[menusection] }}
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                text
                @click="dialog = false"
              >
                Закрыть
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import forecastApi from "@/api/forecast";

export default {
  name: "Options",
  components: {
    // LControl
  },
  data: () => ({
    forecastTypes: ["00", "12"],
    models: [],
    eventGroups: [],
    indexList: [],
    dialog: false,
    modalinfo: {
      model: "Метеорологическая модель, на основе которой формируются области опасных явлений",
      eventgroup: "Группа опасных явлений, которые отображаются на карте",
      forecasttime: "Время прогноза",
      index: "Диагностические переменные, рассчитанные на основе выбранной метеорологической модели"
    },
    menusection: "model",
    // TODO по возможности перенсти на бек
    indexesLabels: {
      icon: {
        cape_con: 'cape_con',
        dls: 'dls',
        htop_con: 'htop_con',
        k: 'k',
        lls: 'lls',
        mls: 'mls',
        pmsl: 'pmls',
        t_2m: 'Температура воздуха на уровне 2м',
        td_2m: 'td_2m',
        tot_prec: 'tot_prec',
        tt: 'tt',
        vmax_10m: 'vmax_10m',
        ws_10m: 'ws_10m',
        ww: 'ww'
      },
      gfs:{
          'cape_180-0':'cape_180-0',
          'cape_255-0':'cape_255-0',
          cape_surface:'cape_surface',
          'cin_180-0':'cin_180-0',
          'cin_255-0':'cin_255-0',
          cin_surface:'cin_surface',
          dls:'dls',
          dpt_2m:'dpt_2m',
          ehi:'ehi',
          hlcy:'hlcy',
          k:'k',
          lls:'lls',
          mls:'mls',
          prate_surface:'prate_surface',
          pwat:'pwat',
          rh_900:'rh_900',
          tmp_2m:'Температура воздуха на уровне 2м',
          tmp_850:'tmp_850',
          tmp_900:'tmp_900',
          tmp_925:'tmp_925',
          tt:'tt',
          wmaxshear:'wmaxshear',
          ws_10m:'ws_10m'
      }
    }
  }),
  computed: {
    ...mapState({
      isVisible: "isConfigVisible"
    }),
    selectedModel: {
      get() {
        return this.$store.state.selectedModel;
      },
      set(value) {
        this.setModel(value);
      }
    },
    selectedEvent: {
      get() {
        return this.$store.state.selectedEvent;
      },
      set(value) {
        this.setSelectedEvent(value);
      }
    },
    selectedIndex: {
      get() {
        return this.$store.state.selectedIndex;
      },
      set(value) {
        this.setSelectedIndex(value);
      }
    },
    indexActive: {
      get() {
        return this.$store.state.indexActive;
      },
      set(value) {
        this.setIndexActive(value);
      }
    },
    selectedDisplayType: {
      get(){
        return this.$store.state.selectedDisplayType;
      },
      set(value) {
        this.setDisplayType(value);
      }
    }
  },
  watch: {
    selectedModel: function() {
      this.getGroups();
      this.getIndexes();
    }
  },
  async mounted() {
    this.getModels();
    this.getGroups();
    this.getIndexes();
  },
  methods: {
    ...mapMutations({
      setConfigVisibility: "SET_CONFIG_VISIBILITY",
      setForecastTypes: "SET_FORECAST_TYPE",
      setModel: "SET_MODEL",
      setSelectedEvent: "SET_SELECTED_EVENT",
      setSelectedIndex: "SET_SELECTED_INDEX",
      setIndexActive: "SET_INDEX_VISIBILITY",
      setDisplayType: "SET_SELECTED_DISPLAY_TYPE"
    }),
    getModels() {
      forecastApi.models()
        .then(data => data.data)
        .then(res => {
          this.models = res.models;
          this.setModel(res.models[0]);
        })
        .catch(() => {
          this.models = [];
          this.setModel(null);
        });
    },
    getGroups() {
      forecastApi.eventGroups(this.selectedModel)
        .then(data => data.data)
        .then(res => {
          this.eventGroups = res.groups;
          this.setSelectedEvent(res.groups[0]);
        })
        .catch(() => {
          this.eventGroups = [];
          this.setSelectedEvent(null);
        });
    },
    getIndexes() {
      forecastApi.indexes(this.selectedModel)
        .then(data => data.data)
        .then(res => {
          this.indexList = res.indexes.map(index => {
            return {
              value: index,
              text: this.indexesLabels[this.selectedModel][index]
            }
          });
          this.setSelectedIndex(res.indexes[0]);
        })
        .catch(() => {
          this.indexList = [];
          this.setSelectedIndex(null);
        });
    }
  }
};
</script>

<style >
</style>