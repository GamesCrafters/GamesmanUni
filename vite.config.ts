import vueI18n from "@intlify/vite-plugin-vue-i18n";
import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
// Importing package.json exposed the whole JSON in production.
// It should be fine for this particular project as this is an open source project.
// I is not appropriate to do so for project where package.json should be private.
import packageJson from "./package.json";

const alias: Record<string, string> = {
    "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
};

export default defineConfig({
    define: { PACKAGE_VERSION: JSON.stringify(packageJson.version) },
    plugins: [
        legacy({
            targets: ["defaults"],
        }),
        vue(),
        vueI18n({
            compositionOnly: true,
            fullInstall: false,
        }),
    ],
    resolve: {
        alias,
    },
    base: "/uni/",
});
