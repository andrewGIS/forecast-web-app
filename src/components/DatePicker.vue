<template>
  <v-snackbar value="true" multi-line timeout="-1" max-width="50"  vertical>
    <!-- <template v-slot:action="{ attrs }"> -->
    <v-container>
      <v-row justify='center' style="align-items:center">
        <v-btn icon color="pink" >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        Дата
        <v-btn icon color="pink" >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-row>
      <v-row justify='center' style="align-items:center">
        <v-btn icon color="pink" >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        Время
        <v-btn icon color="pink">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-row>
      <!-- </template> -->
    </v-container>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    snackbar: true
  })
};
</script>