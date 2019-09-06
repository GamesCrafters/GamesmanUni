import Vue from "vue";
import Router from "vue-router";
import VHome from "@/views/VHome.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: VHome
    },
    {
      path: "/games",
      component: () =>
        import(/* webpackChunkName: "games" */ "./views/VGames.vue")
    },
    {
      path: "/game/:gameId",
      name: "game",
      component: () =>
        import(/* webpackChunkName: "game" */ "./views/VGame.vue")
    },
    {
      path: "/about",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/VAbout.vue")
    },
    {
      path: "*",
      component: () =>
        import(
          /* webpackChunkName: "pageNotFound" */ "./views/VPageNotFound.vue"
        )
    }
  ]
});
