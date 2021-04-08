import "@/vueAxios";
import "@/vueCompositionAPI";
import "@/vueMeta";
import "@/registerServiceWorker";
import Vue from "vue";
import App from "@/App.vue";
import router from "@/vueRouter";
import store from "@/vuex";
import i18n from "@/vueI18n";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
