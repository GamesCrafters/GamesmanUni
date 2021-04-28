import { defineConfig } from "vite";
// import { resolve } from "path";
import loadVersion from "vite-plugin-package-version";
import vue from "@vitejs/plugin-vue";
import vueI18n from "@intlify/vite-plugin-vue-i18n";

const alias: Record<string, string> = {
    "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
};

// https://vitejs.dev/config/
export default defineConfig({
    define: { "process.env": {} },
    plugins: [
        loadVersion(),
        vue(),
        vueI18n({
            compositionOnly: true,
            fullInstall: false,
            // include: resolve(__dirname, "./src/docs/**"),
        }),
    ],
    resolve: {
        alias,
    },
});
