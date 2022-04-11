import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import Legacy from "@vitejs/plugin-legacy";
import LoadVersion from "vite-plugin-package-version";
import Vue from "@vitejs/plugin-vue";
import VueI18n from "@intlify/vite-plugin-vue-i18n";

const alias: Record<string, string> = {
    "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
};

export default defineConfig({
    base: "/uni/",
    build: {
        manifest: true,
        rollupOptions: {
            output: {
                sourcemap: false,
            },
        },
        sourcemap: false,
    },
    plugins: [
        Legacy({
            targets: ["defaults"],
        }),
        LoadVersion(),
        VitePWA({
            includeAssets: ["robot.txt", "assets/favicon.ico", "assets/safari-pinned-tab.svg", "assets/apple-touch-icon.png"],
            manifest: {
                name: "GamesmanUni",
                short_name: "GamesmanUni",
                description: "GamesmanUni",
                theme_color: "#2b5797",
                icons: [
                    {
                        src: "assets/android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "assets/android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "assets/android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                ],
            },
            registerType: "autoUpdate",
            workbox: {
                cleanupOutdatedCaches: true,
                sourcemap: false,
            },
        }),
        Vue(),
        VueI18n({
            compositionOnly: true,
            fullInstall: false,
        }),
    ],
    resolve: {
        alias,
    },
});
