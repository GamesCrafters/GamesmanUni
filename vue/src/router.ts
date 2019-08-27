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
      name: "vHome",
      component: VHome
    },
    {
      path: "/games",
      name: "vGames",
      component: () =>
        import(/* webpackChunkName: "vGames" */ "./views/VGames.vue")
    },
    {
      path: "/game/:solverId/:gameId",
      name: "vGame",
      component: () => import(/* webpackChunkName: "vGame" */ "./views/VGame.vue")
    },
    {
      path: "/about",
      name: "vAbout",
      component: () =>
        import(/* webpackChunkName: "vAbout" */ "./views/VAbout.vue")
    },
    {
      path: "*",
      name: "vPageNotFound",
      component: () =>
        import(
          /* webpackChunkName: "vPageNotFound" */ "./views/VPageNotFound.vue"
        )
    }
  ]
});
