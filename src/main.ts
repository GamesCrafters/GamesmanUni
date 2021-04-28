import { createApp } from "vue";
import { i18n } from "./plugins/i18n";
import { store } from "./plugins/store";
import { router } from "./plugins/router";
// import { metaManager } from "./plugins/meta";
import { axios, VueAxios } from "./plugins/axios";
import { VueMarkdownIt } from "./plugins/markdownIt";
import { vuetify } from "./plugins/vuetify";
import App from "./App.vue";

const app = createApp(App);
app.use(i18n);
app.use(store);
app.use(router);
// app.use(metaManager);
app.use(VueAxios, axios);
app.use(VueMarkdownIt);
app.use(vuetify);
app.mount("#app");
