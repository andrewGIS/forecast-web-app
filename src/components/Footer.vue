<template>
  <v-container>

    <!-- Config button -->
    <v-row align="center" justify="space-between">
      <v-col class="d-flex" cols="1">
        <v-btn class="mx-4" icon>
          <v-icon size="24px"> mdi-cog-outline </v-icon>
        </v-btn>
      </v-col>

        <!-- Date and hour picker -->
        <v-col cols="10">
            <v-slide-group mandatory show-arrows center-active>
              <v-slide-item
                v-for="n in dates"
                :key="n"
                v-slot="{ active, toggle }"
              >
                <v-btn
                  class="mx-2"
                  :input-value="active"
                  active-class="purple white--text"
                  depressed
                  rounded
                  @click="toggle"
                >
                  {{ n }}
                </v-btn>
              </v-slide-item>
            </v-slide-group>

            <v-slide-group mandatory show-arrows center-active>
              <v-slide-item
                v-for="n in forecastHours"
                :key="n"
                v-slot="{ active, toggle }"
              >
                <v-btn
                  class="mx-2"
                  :input-value="active"
                  active-class="purple white--text"
                  depressed
                  rounded
                  @click="toggle"
                >
                  {{ n }}
                </v-btn>
              </v-slide-item>
            </v-slide-group>
          <!-- </v-sheet> -->
        </v-col>

        <!-- Legend picker -->
        <v-col cols="1" class="text-right">
          <!-- <spacer/> -->
          <v-btn class="mx-4" icon>
            <v-icon size="24px"> mdi-cog-outline </v-icon>
          </v-btn>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  computed: {
    forecastHours() {
      return [
        "00:00",
        "03:00",
        "06:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00"
      ];
    }
  },
  data: () => ({
    dates: ["19.07.2021", "20.07.2021"],
    icons: ["mdi-cog-outline", "mdi-calendar", "mdi-delete"],
    padless: false,
    variant: "default",
    model: null
  })
};
</script>