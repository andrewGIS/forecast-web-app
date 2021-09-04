<template>
  <v-snackbar
    left
    bottom
    :value="isVisible"
    timeout="-1"
    max-width="100"
  >
    <v-container fluid>
      <v-row justify="end">
        <v-btn
          class="mx-4"
          icon
          @click="setConfigVisibility(false)"
        >
          <v-icon size="24px">
            mdi-close
          </v-icon>
        </v-btn>
      </v-row>
      <v-row>
        <v-select
          v-model="selectedforecastType"
          :items="forecastTypes"
          filled
          label="Тип прогноза"
          dense
          solo
        />
      </v-row>

      <v-row>
        <v-select
          v-model="selectedModel"
          :items="models"
          filled
          label="Модель"
          dense
          solo
        />
      </v-row>

      <v-row>
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
      </v-row>
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
    models: ["gfs", "icon"],
    eventGroups: []
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
    }
  },
  mounted() {
    this.getGroups();
  },
  methods: {
    ...mapMutations({
      setConfigVisibility: "SET_CONFIG_VISIBILITY",
      setForecastTypes: "SET_FORECAST_TYPE",
      setModel: "SET_MODEL",
      setSelectedEvent: "SET_SELECTED_EVENT"
    }),
    getGroups() {
      // eslint-disable-next-line no-undef
      fetch(`${process.env.VUE_APP_API_BASE}/event_groups?model=${this.selectedModel}`)
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
  }
};
</script>

<style>
</style>
