<template>
  <div id="app-header">
    <router-link class="c-link-router" to="/">
      <img
        id="app-header-logo"
        alt="Gamesman Logo"
        src="@/assets/app-logo.png"
      />
    </router-link>
    <h1 id="app-header-title">GamesmanUni</h1>
    <div id="app-header-nav">
      <router-link class="c-link-router" to="/">Home</router-link> |
      <router-link class="c-link-router" to="/games">Games</router-link> |
      <router-link class="c-link-router" to="/about">About</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class CHeader extends Vue {}
</script>

<style scoped lang="scss">
#app-header-nav {
  padding: 0 0 10px 0;
  .c-link-router {
    font-size: 18px;
  }
}
</style>
