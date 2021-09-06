<template>
  <v-snackbar left bottom :value="isVisible" timeout="-1" max-width="100">
    <v-container fluid>
      <v-row justify="end">
        <v-btn class="mx-4" icon @click="setConfigVisibility(false)">
          <v-icon size="24px"> mdi-close </v-icon>
        </v-btn>
      </v-row>
      
      <v-row>
        <v-select
          :items="models"
          v-model="selectedModel"
          filled
          label="Модель"
          dense
          solo
        ></v-select>
      </v-row>

      <v-row>
        <v-select
          label="Выберите группу"
          :items="eventGroups"
          item-text="alias"
          v-model="selectedEvent"
          filled
          dense
          solo
          return-object
        ></v-select>
      </v-row>

      <v-row>
        <v-select
          :items="forecastTypes"
          v-model="selectedforecastType"
          filled
          label="Тип прогноза"
          dense
          solo
        ></v-select>
      </v-row>

      <v-row>
        <v-checkbox
          @change="indexActive = !indexActive"
          :checked="indexActive"
        ></v-checkbox>
        <v-select          
          :items="indexList"
          v-model="selectedIndex"
          filled
          dense
          solo
          :disabled="!indexActive"
        ></v-select>
      </v-row>
    </v-container>
  </v-snackbar>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data: () => ({
    forecastTypes: ["00", "12"],
    models: [],
    eventGroups: [],
    indexList: [],
    indexActive: false
  }),
  name: "Options",
  components: {
    
  },
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
  },
  methods: {
    ...mapMutations({
      setConfigVisibility: "SET_CONFIG_VISIBILITY",
      setForecastTypes: "SET_FORECAST_TYPE",
      setModel: "SET_MODEL",
      setSelectedEvent: "SET_SELECTED_EVENT",
      setSelectedIndex: "SET_SELECTED_INDEX"
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
      fetch(`${process.env.VUE_APP_API_BASE}/event_groups?model=${this.selectedModel}`)
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
      fetch(`${process.env.VUE_APP_API_BASE}/indexes?model=${this.selectedModel}`)
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

  },
  watch: {
    selectedModel: function () {
      this.getGroups();
      this.getIndexes();
    }
  },
  mounted() {
    this.getGroups();
    this.getModels();
    this.getIndexes();
  }
};
</script>

<style>
</style>