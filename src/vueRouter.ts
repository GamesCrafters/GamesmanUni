import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: Home
    },
    {
      path: "/games",
      component: () =>
        import(/* webpackChunkName: "games" */ "./views/Games.vue")
    },
    {
      path: "/games/:gameId/variants",
      name: "variants",
      component: () =>
        import(/* webpackChunkName: "variants" */ "./views/Variants.vue")
    },
    {
      path: "/games/:gameId/variants/:variantId",
      name: "game",
      component: () => import(/* webpackChunkName: "game" */ "./views/Game.vue")
    },
    {
      path: "/about",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/updates",
      component: () =>
        import(/* webpackChunkName: "updates" */ "./views/Updates.vue")
    },
    {
      path: "*",
      component: () =>
        import(
          /* webpackChunkName: "pageNotFound" */ "./views/PageNotFound.vue"
        )
    }
  ]
});
