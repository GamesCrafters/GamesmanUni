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
        import(/* webpackChunkName: "games" */ "./views/AppGames.vue")
    },
    {
      path: "/game/:gameId/:gameVariation",
      name: "game",
      component: () =>
        import(/* webpackChunkName: "game" */ "./views/AppGame.vue")
    },
    {
      path: "/about",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/AppAbout.vue")
    },
    {
      path: "*",
      component: () =>
        import(
          /* webpackChunkName: "pageNotFound" */ "./views/AppPageNotFound.vue"
        )
    }
  ]
});
