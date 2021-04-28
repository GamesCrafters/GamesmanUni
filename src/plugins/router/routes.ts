import TheHomePage from "../../components/TheHomePage.vue";
import TheAboutPage from "../../components/TheAboutPage.vue";
import ThePuzzlesPage from "../../components/ThePuzzlesPage.vue";
import TheGamesPage from "../../components/TheGamesPage.vue";
import TheVariantsPage from "../../components/TheVariantsPage.vue";
import TheGamePage from "../../components/TheGamePage.vue";
import TheUpdatesPage from "../../components/TheUpdatesPage.vue";
import The404Page from "../../components/The404Page.vue";

export const routes = [
    { path: "/", component: TheHomePage, name: "home" },
    { path: "/about", component: TheAboutPage, name: "about" },
    { path: "/puzzles", component: ThePuzzlesPage, name: "puzzles" },
    { path: "/games", component: TheGamesPage, name: "games" },
    { path: "/:type/:gameId/variants", component: TheVariantsPage, name: "variants" },
    { path: "/:type/:gameId/variants/:variantId", component: TheGamePage, name: "game" },
    { path: "/updates", component: TheUpdatesPage, name: "updates" },
    { path: "/:pathMatch(.*)*", component: The404Page, name: "pageNotFound" },
];
