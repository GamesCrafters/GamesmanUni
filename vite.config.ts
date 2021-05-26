import vueI18n from "@intlify/vite-plugin-vue-i18n";
import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import loadVersion from "vite-plugin-package-version";

const alias: Record<string, string> = {
    "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
};

export default defineConfig({
    define: { "process.env": {} },
    plugins: [
        legacy({
            targets: ["defaults"],
        }),
        loadVersion(),
        vue(),
        vueI18n({
            compositionOnly: true,
            fullInstall: false,
        }),
    ],
    resolve: {
        alias,
    },
});
