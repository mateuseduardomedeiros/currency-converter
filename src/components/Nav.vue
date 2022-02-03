<template>
  <v-app-bar app>
    <h1 class="title">Conversor de Moedas</h1>
    <v-spacer />
    <DarkModeSwitch @switched="onSwitched" :initialState="darkMode" />
  </v-app-bar>
</template>

<script>
import DarkModeSwitch from "vue-dark-mode-switch";
import "vue-dark-mode-switch/dist/vue-dark-mode-switch.css";
export default {
  name: "Nav",
  components: {
    DarkModeSwitch,
  },
  data() {
    return {
      darkMode: true,
    };
  },
  created() {
    this.darkMode = JSON.parse(`${localStorage.dark}`);
    this.$vuetify.theme.dark = JSON.parse(`${localStorage.dark}`);
  },
  methods: {
    onSwitched() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.darkMode = !this.darkMode;
      localStorage.dark = this.darkMode;
    },
  },
};
</script>

<style></style>
