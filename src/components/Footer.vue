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

        <v-slide-group
          show-arrows
          center-active
          v-model="selectedDate"
        >
          <v-slide-item
            v-for="(date, index) in generateForecastDates"
            :key="index"
            v-slot="{ active, toggle }"
            :value="date"
          >
            <v-btn
              class="mx-2"
              :input-value="active"
              active-class="purple white--text"
              depressed
              rounded
              @click=toggle
            >
              {{ date.toLocaleString().split(",")[0] }}
              <br />
              {{ `${hour2string(date.getHours(), true)}` }}
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
    ...mapState(['selectedForescatType']),
    selectedDate:{
      get(){
        return this.$store.state.selectedDate
      },
      set(value){
        this.setDate(value)
      }
    },
    generateForecastDates() {
      let currentDate = new Date();
      let currentHours = currentDate.getHours();
      let startDate;
      let outDates = [];

      // if possible refactor
      if (currentHours < 12 && this.selectedForescatType === "00"){
        startDate = new Date(currentDate.setHours(0, 0, 0))
      }
      if (currentHours < 12 && this.selectedForescatType === "12"){
        startDate = new Date(currentDate.setHours(12, 0, 0))
        startDate = this.shiftDate(startDate, "Hours", -24);
      }
      if(currentHours > 12 && this.selectedForescatType === "00"){
        startDate = new Date(currentDate.setHours(0, 0, 0))
      }
      if(currentHours > 12 && this.selectedForescatType === "12"){
        startDate = new Date(currentDate.setHours(12, 0, 0))
      }
      

      for (let index = 0; index < 8; index++) {
        let newValue = new Date(this.shiftDate(startDate, "Hours", 3));
        outDates.push(newValue);
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
      const hourMap = {
        0: "00:00",
        3: "03:00",
        6: "06:00",
        9: "09:00",
        12: "12:00",
        15: "15:00",
        18: "18:00",
        21: "21:00"
      };

      return full ? hourMap[hour] : hourMap[hour].split(':')[0] ;
    }
  },
  mounted(){
    this.selectedDate = this.generateForecastDates[0];
  }
};
</script>