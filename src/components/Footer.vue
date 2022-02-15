<template>
  <v-container>
    <!-- Config button -->
    <v-row
      align="center"
      justify-sm="space-around"
    >
      <!-- Options picker -->
      <v-col 
        cols="2" 
        sm="1"
      >
        <v-btn
          icon
          @click="setConfigVisibility(true)"
        >
          <v-icon size="24px">
            mdi-cog-outline
          </v-icon>
        </v-btn>
      </v-col>
      <!-- Date picker -->
      <v-col 
        cols="4" 
        sm="2"
      >
        <v-tooltip
          v-model="dateIsActive"
          top
          z-index="1000"
        >
          <template #activator="{ attrs }">
            <v-btn
              class="d-flex d-sm-flex"
              v-bind="attrs"
              @click="dateIsActive = !dateIsActive"
            >
              {{ selectedDate }} 
            </v-btn>
            <!-- <v-btn
              class="d-xs-flex d-sm-none"
              v-bind="attrs"
              @click="dateIsActive = !dateIsActive"
            >
              <v-icon>
                mdi-clock
              </v-icon>
            </v-btn> -->
          </template>
          <div class="date-picker-wrapper">
            <v-date-picker
              v-model="selectedDate" 
              locale="ru-ru"
              :allowed-dates="availableDatesFunc"
            />
          </div>
        </v-tooltip>
      </v-col>

      <!-- Hour picker -->
      <v-col 
        cols="4" 
        sm="8"
      >
        <v-slide-group
          v-model="selectedHour"
          show-arrows
          center-active
          class="d-none d-sm-flex"
        >
          <v-slide-item
            v-for="(hour, index) in forecastHours"
            :key="index"
            v-slot="{ active, toggle }"
            :value="hour.value"
            class="ma-1"
          >
            <v-btn
              :input-value="active"
              active-class="purple white--text"
              depressed
              rounded
              @click="toggle"
            >
              {{ hour.label }}
            </v-btn>
          </v-slide-item>
        </v-slide-group>

        <div class="d-xs-flex d-sm-none">
          <v-btn
            icon
            small
            @click="moveHour(-1)"
          >
            <v-icon>
              mdi-skip-previous
            </v-icon>
          </v-btn>
          <span :style="{fontSize: '0.875rem', fontWeight: 500}">
            {{ selectedHourLabel }}
          </span>
          <v-btn
            icon
            small
            @click="moveHour(1)"
          >
            <v-icon>
              mdi-skip-next
            </v-icon>
          </v-btn>
        </div>
      </v-col>

      <!-- Legend picker -->
      <v-col 
        cols="2"
        sm="1"
      >
        <v-btn
          icon
          @click="setLegendVisibility(true)"
        >
          <v-icon size="24px">
            mdi-map-legend
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import {formatAsUTCDate} from '../utils/utils';

export default {
  data: () => ({
    dateIsActive: false,
    selectedHour: 3,
    selectedHourLabel: "03:00", // для маленьких дисплеев
    // eslint-disable-next-line
    selectedDate1: formatAsUTCDate(new Date(),'-'),
    selectedDate: '2021-05-15',
    availableDates: [] // Даты для которых есть прогноз
  }),
  computed: {
    ...mapState(["selectedModel", "forecastHours"]),
    selectedDateObj(){
      let dateLocal = new Date(this.selectedDate)
      dateLocal.setHours(this.selectedHour) 
      return dateLocal
    },
  },
  watch: {
    selectedDateObj (value) {
      this.setDate(value)
    }
  },
  async mounted() {
    const baseURL = `${process.env.VUE_APP_API_BASE}/get_dates?`;
      const params = [
        `model=${this.selectedModel}`,
      ]
    const url = baseURL + params.join("&");
    let response = await fetch(url);
    let dates = await response.json();
    this.availableDates = dates
  },
  methods: {
    ...mapMutations({
      setConfigVisibility: "SET_CONFIG_VISIBILITY",
      setLegendVisibility: "SET_LEGEND_VISIBILITY",
      setDate: "SET_SELECTED_DATE"
    }),
    availableDatesFunc(val){
      return this.availableDates.includes(val);
    },
    moveHour(step) {
      const currentIndex = this.forecastHours.findIndex(({value})=> value === this.selectedHour)
      if (!this.forecastHours[currentIndex + step] ) return
      this.selectedHour = this.forecastHours[currentIndex + step].value
      this.selectedHourLabel = this.forecastHours[currentIndex + step].label
    }
  }
};
</script>
<style scoped>

.v-tooltip__content {
  padding: 0px 0px;
  opacity: 1.0 !important
}

.date-picker-wrapper {
  pointer-events: all
}
</style>

