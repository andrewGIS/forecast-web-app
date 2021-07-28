<template>
  <v-container>
    <!-- Config button -->
    <v-row align="center" justify="space-between">
      <v-col cols="1" class="text-left">
        <v-btn class="mx-4" icon @click="setConfigVisibility(true)">
          <v-icon size="24px"> mdi-cog-outline </v-icon>
        </v-btn>
      </v-col>

      <!-- Date and hour picker -->
      <!-- TODO Extract date picker to separate component-->
      <v-col cols="9" сlass="text-center">
        Время прогноза

        <v-slide-group show-arrows center-active v-model="selectedDate">
          <v-slide-item
            v-for="(date, index) in generateForecastDates"
            :key="index"
            v-slot="{ active, toggle }"
            :value="date.utcDate"
          >
            <v-btn
              class="mx-2"
              :input-value="active"
              active-class="purple white--text"
              depressed
              rounded
              @click="toggle"
            >
              {{ date.localeDate.split(",")[0]}}
              <br>
              {{ date.localeDate.split(",")[1]}}
              <!-- {{ hour2string(date.getHours(), true )}} -->
            </v-btn>
          </v-slide-item>
        </v-slide-group>
      </v-col>

      <!-- Legend picker -->
      <v-col cols="1" class="text-right">
        <v-btn class="mx-4" icon>
          <v-icon size="24px"> mdi-cog-outline </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  computed: {
    ...mapState(["selectedForescatType"]),
    selectedDate: {
      get() {
        return this.$store.state.selectedDate;
      },
      set(value) {
        this.setDate(value);
      }
    },
    generateForecastDates() {
      let utcDate = this.convertDateToUTC(new Date());
      let utcHours = utcDate.getUTCHours();
      let startDate;
      let outDates = [];

      // if possible refactor
      if (utcHours < 12 && this.selectedForescatType === "00"){
        startDate = new Date(utcDate.setUTCHours(0, 0, 0))
      }
      if (utcHours < 12 && this.selectedForescatType === "12"){
        startDate = new Date(utcDate.setUTCHours(12, 0, 0))
        startDate = this.shiftDate(startDate, "Hours", -24);
      }
      if(utcHours >= 12 && this.selectedForescatType === "00"){
        startDate = new Date(utcDate.setUTCHours(0, 0, 0))
      }
      if(utcHours >= 12 && this.selectedForescatType === "12"){
        startDate = new Date(utcDate.setUTCHours(12, 0, 0))
      }

      for (let index = 0; index < 8; index++) {
        let newValue = new Date(this.shiftDate(startDate, "Hours", 3));
        let obj = {};
        obj.utcDate = newValue;
        obj.localeDate = newValue.toLocaleString()
        outDates.push(obj);
      }

      return outDates;
    }
  },
  methods: {
    ...mapMutations({ 
      setConfigVisibility: "SET_CONFIG_VISIBILITY",
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
      hour = hour < 10 ? `0${hour}:00` : `${hour}:00`  

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
    }
  },
  mounted() {
    this.selectedDate = this.generateForecastDates[0].utcDate;
  }
};
</script>