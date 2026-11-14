import { createApp } from "vue";
import { i18n } from "./scripts/plugins/i18n";
import { store } from "./scripts/plugins/store";
import { router } from "./scripts/plugins/router";
import { metaManager } from "./scripts/plugins/meta";
import { axios, VueAxios } from "./scripts/plugins/axios";
import { VueMarkdownIt } from "./scripts/plugins/markdownIt";
import chalkboardTexture from "./models/images/texture-chalkboard.jpg";
import chalkboardTextureDark from "./models/images/texture-chalkboard-dark.jpg";
import App from "./App.vue";

const app = createApp(App);
app.use(i18n);
app.use(store);
app.use(router);
app.use(metaManager);
app.use(VueAxios, axios);
app.use(VueMarkdownIt);

/**
 * Apply saved display preferences before mounting so the very first paint is
 * already themed. Without this the app renders with the default theme for a
 * frame and then swaps once the preferences panel mounts.
 */
const applySavedPreferences = () => {
    try {
        const raw = localStorage.getItem("userPreferences");
        if (!raw) return;
        const saved = JSON.parse(raw);
        const root = document.getElementById("app");
        if (root && saved.theme) root.classList.add(`uni-theme-${saved.theme}`);
        if (saved.fontSize) document.documentElement.style.fontSize = `${saved.fontSize}px`;
        if (saved.locale) document.documentElement.lang = saved.locale === "zh" ? "zh-Hans" : saved.locale;
    } catch {
        // Malformed preferences: fall back to defaults rather than blocking startup.
    }
};

/**
 * Hand the chalkboard textures to CSS as variables. Importing them here lets
 * Vite hash the assets and prefix the configured base; a relative url() inside
 * the forwarded SCSS partial resolves against the wrong root and 404s.
 */
const applyThemeAssets = () => {
    const root = document.getElementById("app");
    if (!root) return;
    root.style.setProperty("--gu-chalk-texture", `url("${chalkboardTexture}")`);
    root.style.setProperty("--gu-chalk-texture-dark", `url("${chalkboardTextureDark}")`);
};

applySavedPreferences();
applyThemeAssets();
app.mount("#app");
