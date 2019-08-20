<template>
  <div id="app">
    <div id="app-header">
      <img id="app-logo" alt="Gamesman Logo" src="./assets/app-logo.png" />
      <h1 id="app-title">GamesmanUni</h1>
      <div id="app-nav">
        <router-link class="app-nav-link" to="/">Home</router-link> |
        <router-link class="app-nav-link" to="/games">Games</router-link> |
        <router-link class="app-nav-link" to="/about">About</router-link>
      </div>
    </div>
    <hr class="divider" />
    <router-view />
    <hr class="divider" />
    <div id="app-footer">
      <p id="app-copyright">
        ©
        <a
          href="http://gamescrafters.berkeley.edu/"
          target="_blank"
          rel="noreferrer"
          >GamesCrafters</a
        >
        and UC Regents
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class Home extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 0 10% 0 10%;
  p {
    padding: 0 20% 0 20%;
  }
}

#app-nav {
  padding: 0 0 10px 0;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.app-nav-link {
  font-size: 18px;
}

.divider {
  border: 0.5px dotted;
}
</style>
