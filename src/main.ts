import { createApp } from "vue";
import { i18n } from "./scripts/plugins/i18n";
import { store } from "./scripts/plugins/store";
import { router } from "./scripts/plugins/router";
import { metaManager } from "./scripts/plugins/meta";
import { axios, VueAxios } from "./scripts/plugins/axios";
import { VueMarkdownIt } from "./scripts/plugins/markdownIt";
import App from "./App.vue";

const app = createApp(App);
app.use(i18n);
app.use(store);
app.use(router);
app.use(metaManager);
app.use(VueAxios, axios);
app.use(VueMarkdownIt);
app.mount("#app");
