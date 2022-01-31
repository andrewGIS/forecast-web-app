<template>
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
        <v-btn
          class="mx-0"
          icon
          @click="setConfigVisibility(false)"
        >
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
        <v-col
          cols="10"
          class="pa-0"
        >
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
              <v-radio
                label="Растр"
                value="raster"
              />
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
          Время прогноза
        </v-col>
      </v-row>
      <v-row class="pa-0">
        <v-col
          cols="10"
          class="pa-0"
        >
          <!-- <v-select
            v-model="selectedforecastType"
            :items="forecastTypes"
            filled
            label="Тип прогноза"
            dense
            solo
          /> -->
        </v-col>
        <v-col
          cols="2"
          class="pa-0"
        >
          <v-btn
            class="mx-4"
            icon
            @click="(dialog = true), (menusection = 'forecasttime')"
          >
            <v-icon size="24px">
              mdi-information
            </v-icon>
          </v-btn>
        </v-col>
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
</template>

<script>
import { mapState, mapMutations } from "vuex";

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
      model: "Модель",
      eventgroup: "Группа явлений",
      forecasttime: "Время прогноза",
      index: "Диагностические переменные"
    },
    menusection: "model"
  }),
  computed: {
    ...mapState({
      isVisible: "isConfigVisible"
    }),
    selectedforecastType: {
      get() {
        return this.$store.state.selectedForescatType;
      },
      set(value) {
        this.setForecastTypes(value);
      }
    },
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
  mounted() {
    this.getGroups();
    this.getModels();
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
      fetch(`${process.env.VUE_APP_API_BASE}/models`)
        .then(data => data.json())
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
      fetch(
        `${process.env.VUE_APP_API_BASE}/event_groups?model=${this.selectedModel}`
      )
        .then(data => data.json())
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
      fetch(
        `${process.env.VUE_APP_API_BASE}/indexes?model=${this.selectedModel}`
      )
        .then(data => data.json())
        .then(res => {
          this.indexList = res.indexes;
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