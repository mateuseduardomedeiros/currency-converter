<template>
  <v-app>
    <v-main>
      <Nav />
      <v-container fluid>
        <Card />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Nav from "./components/Nav.vue";
import Card from "./components/Card.vue";

export default {
  name: "App",

  components: {
    Nav,
    Card,
  },

  data: () => ({
    //
  }),
};
</script>
