import TheHomePage from "../../../components/views/TheHomePage.vue";
import TheAboutPage from "../../../components/views/TheAboutPage.vue";
import TheGamesPage from "../../../components/views/TheGamesPage.vue";
import TheVariantsPage from "../../../components/views/TheVariantsPage.vue";
import TheGamePage from "../../../components/views/TheGamePage.vue";
import TheUpdatesPage from "../../../components/views/TheUpdatesPage.vue";
import TheDemoPage from "../../../components/views/TheDemoPage.vue"
import The404Page from "../../../components/views/The404Page.vue";

export const routes = [
    { path: "/", component: TheHomePage, name: "home" },
    { path: "/about", component: TheAboutPage, name: "about" },
    { path: "/:type", component: TheGamesPage, name: "games" },
    { path: "/:type", component: TheGamesPage, name: "puzzles" },
    { path: "/:type/:gameId/variants", component: TheVariantsPage, name: "variants" },
    { path: "/:type/:gameId/variants/:variantId", component: TheGamePage, name: "game" },
    { path: "/updates", component: TheUpdatesPage, name: "updates" },
    { path: "/demo", component: TheDemoPage, name: "demo" },
    { path: "/:pathMatch(.*)*", component: The404Page, name: "pageNotFound" },
];
