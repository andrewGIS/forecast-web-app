<!--TODO Разметка кривая( придумать что-то получше-->
<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <Options />
      </v-col>
      <v-col cols="8">
        <date-time-picker />
      </v-col>
      <v-col>
        <v-spacer />
        <Legend />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Legend from "@/components/FooterLegend"
import Options from "@/components/FooterOptions"
import DateTimePicker from "@/components/FooterDatePicker";

export default {
  name: 'Footer',
  components: {
    DateTimePicker,
    Legend,
    Options,
  }
};
</script>
<style>
</style>

