<template>
  <v-container>
    <!-- Config button -->
    <v-row
      align="center"
      justify="space-between"
    >
      <v-col
        cols="auto"
        class="text-left"
      >
        <v-btn
          class="mx-4"
          icon
          @click="setConfigVisibility(true)"
        >
          <v-icon size="24px">
            mdi-cog-outline
          </v-icon>
        </v-btn>
      </v-col>

      <!-- Date and hour picker -->
      <!-- TODO Extract date picker to separate component-->
      <v-col cols="auto">
        <v-tooltip
          v-model="dateIsActive"
          top
          z-index="10000"
        >
          <template #activator="{ attrs }">
            <v-btn 
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
              :allowed-dates="avialableDatesFunc"
            />
          </div>
        </v-tooltip>
      </v-col>
      <v-col
        cols="auto"
        сlass="text-center"
      >
        <v-slide-group
          v-model="selectedHour"
          show-arrows
          center-active
        >
          <v-slide-item
            v-for="(hour, index) in forecastHours"
            :key="index"
            v-slot="{ active, toggle }"
            :value="hour.value"
          >
            <v-btn
              class="mx-2"
              :input-value="active"
              active-class="purple white--text"
              depressed
              rounded
              @click="toggle"
            >
              {{ hour.label }}
              <!-- {{ hour2string(date.getHours(), true )}} -->
            </v-btn>
          </v-slide-item>
        </v-slide-group>
      </v-col>

      <!-- Legend picker -->
      <v-col
        cols="auto"
        class="text-right"
      >
        <v-btn
          class="mx-4"
          icon
          @click="setLegendVisibility(true)"
        >
          <v-icon size="24px">
            mdi-cog-outline
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  data: () => ({
    dateIsActive: false,
    firstDate: null,
    selectedHour: 3,
    //selectedDate: (`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDay()}`)
    selectedDate: `2022-01-13`,
    avialableDates: []
  }),
  computed: {
    ...mapState(["selectedForescatType", "selectedModel"]),
    // selectedDate: {
    //   get() {
    //     return this.$store.state.selectedDate;
    //   },
    //   set(value) {
    //     this.setDate(value);
    //   }
    // },
    selectedDateObj(){
      let dateLocal = new Date(this.selectedDate)
      
      dateLocal.setHours(this.selectedHour) 
      return dateLocal
    },
    generateForecastDates() {
      let utcDate = this.convertDateToUTC(
        this.firstDate ? this.firstDate : new Date()
      );
      let utcHours = utcDate.getUTCHours();
      let startDate;
      let outDates = [];

      // if possible refactor
      if (utcHours < 12 && this.selectedForescatType === "00") {
        startDate = new Date(utcDate.setUTCHours(0, 0, 0));
      }
      if (utcHours < 12 && this.selectedForescatType === "12") {
        startDate = new Date(utcDate.setUTCHours(12, 0, 0));
        startDate = this.shiftDate(startDate, "Hours", -24);
      }
      if (utcHours >= 12 && this.selectedForescatType === "00") {
        startDate = new Date(utcDate.setUTCHours(0, 0, 0));
      }
      if (utcHours >= 12 && this.selectedForescatType === "12") {
        startDate = new Date(utcDate.setUTCHours(12, 0, 0));
      }

      for (let index = 0; index < 8; index++) {
        let newValue = new Date(this.shiftDate(startDate, "Hours", 3));
        let obj = {};
        obj.utcDate = newValue;
        obj.localeDate = newValue.toLocaleString();
        outDates.push(obj);
      }

      return outDates;
    }
  },
  // mounted() {
  //   this.selectedDate = this.generateForecastDates[0].utcDate;
  // },
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
    this.avialableDates = dates
  },
  methods: {
    ...mapMutations({
      setConfigVisibility: "SET_CONFIG_VISIBILITY",
      setLegendVisibility: "SET_LEGEND_VISIBILITY",
      setDate: "SET_SELECTED_DATE"
    }),
    shiftDate(date, what, count) {
      let proc1 = "get" + what,
        proc2 = "set" + what;

      let value = Date.prototype[proc1].call(date);
      Date.prototype[proc2].call(date, value + count);
      return date;

      // console.log(shiftDate(new Date, 'Date', -21));
    },
    hour2string(hour, full) {
      hour = hour < 10 ? `0${hour}:00` : `${hour}:00`;

      return full ? hour : hour.split(":")[0];
    },
    convertDateToUTC(date) {
      let utc = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      );
      return new Date(utc);
    },
    avialableDatesFunc(val){
      return this.avialableDates.includes(val);
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

