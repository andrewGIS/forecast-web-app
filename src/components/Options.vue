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
          :items="forecastTypes"
          v-model="selectedforecastType"
          filled
          label="Тип прогноза"
          dense
          solo
        ></v-select>
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
    </v-container>
  </v-snackbar>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data: () => ({
    forecastTypes: ["00", "12"],
    models: ["gfs", "icon"],
    eventGroups: []
  }),
  name: "Options",
  components: {
    // LControl
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
    }
  },
  methods: {
    ...mapMutations({
      setConfigVisibility: "SET_CONFIG_VISIBILITY",
      setForecastTypes: "SET_FORECAST_TYPE",
      setModel: "SET_MODEL",
      setSelectedEvent: "SET_SELECTED_EVENT"
    }),
    getGroups() {
      fetch(`${process.env.VUE_APP_API_BASE}/event_groups?model_name=${this.selectedModel}`)
        .then(data => data.json())
        .then(res => {
          
          // for vuetify correct display transform input object
          // let newArray = res.map((e =>{
          //   let newObject = {};
          //   newObject.alias = e.alias;
          //   newObject.value = e;

          //   return newObject
          //   }
          // ))

          this.eventGroups = res.groups;
          this.setSelectedEvent(res.groups[0]);
        })
        .catch(() => {
          this.eventGroups = [];
          this.setSelectedEvent(null);
        });
    }
  },
  mounted() {
    this.getGroups();
  }
};
</script>

<style>
</style>
