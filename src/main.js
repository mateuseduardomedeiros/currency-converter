import Vue from "vue";
import "./plugins/axios";
import "./plugins/vuetify-mask.js";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import CountryFlag from "vue-country-flag";
Vue.component("flag", CountryFlag);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
