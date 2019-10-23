<template>
  <div id="app">
    <AppHeader></AppHeader>
    <hr class="c-divider" />
    <router-view />
    <hr class="c-divider" />
    <AppFooter></AppFooter>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

@Component({
  components: {
    AppHeader,
    AppFooter
  },
  metaInfo: {
    title: "GamesmanUni",
    titleTemplate: "%s | GamesmanUni"
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@use "@/datas/styles/style";
</style>
