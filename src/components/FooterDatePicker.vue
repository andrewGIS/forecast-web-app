<template>
  <div class="d-flex align-center">
    <!-- Date picker -->
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
      </template>
      <div class="date-picker-wrapper">
        <v-date-picker
          v-model="selectedDate"
          locale="ru-ru"
          :allowed-dates="availableDatesFunc"
        />
      </div>
    </v-tooltip>

    <!-- Hour picker -->
    <v-sheet
      max-width="800"
      min-width="100"
    >
      <v-slide-group
        v-model="selectedHour"
        show-arrows
        center-active
        class="d-none d-sm-flex ml-8"
        mandatory
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

      <div class="d-xs-flex d-sm-none ml-1">
        <v-btn icon small @click="moveHour(-1)">
          <v-icon>
            mdi-skip-previous
          </v-icon>
        </v-btn>
        <span :style="{fontSize: '0.875rem', fontWeight: 500}">
          {{ selectedHourLabel }}
        </span>
        <v-btn icon small @click="moveHour(1)">
          <v-icon>
            mdi-skip-next
          </v-icon>
        </v-btn>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import {formatAsUTCDate} from "@/utils/utils";
import {mapMutations, mapState} from "vuex";
import forecastApi from "@/api/forecast";

export default {
  name: "DateTimePicker",
  data: () => ({
    dateIsActive: false,
    selectedHour: 3,
    selectedHourLabel: "03:00", // для маленьких дисплеев
    selectedDate: process.env.NODE_ENV  === "development" ?
        process.env.VUE_APP_TARGET_CALENDAR_DATE :
        formatAsUTCDate(new Date(),'-'),
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
    await forecastApi.dates(this.selectedModel)
        .then(response => this.availableDates = response.data)
        .catch(error => {
          console.log(error);
          this.availableDates = [];
        })
  },
  methods: {
    ...mapMutations({
      setConfigVisibility: "SET_CONFIG_VISIBILITY",
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
  /*КОСТЫЫЫЛЬ чтобы не был прозрачным календарь*/
  padding: 0px;
  opacity: 1.0 !important
}

.date-picker-wrapper {
  pointer-events: all
}
</style>