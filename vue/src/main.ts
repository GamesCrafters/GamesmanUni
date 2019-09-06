import Vue from "vue";
import VApp from "./VApp.vue";
import router from "./router";
import store from "./store";
import "./axios";
import "./registerServiceWorker";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(VApp)
}).$mount("#app");
