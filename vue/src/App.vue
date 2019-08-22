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
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";

@Component({
  components: {
    AppHeader,
    AppFooter
  }
})
export default class Home extends Vue {}
</script>

<style lang="scss">
// @import "styles";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(41, 44, 51);
  padding: 0 10% 0 10%;
}

.c-divider {
  border: 0.5px dotted;
}

.c-router-link {
  font-weight: bold;
  color: rgb(41, 44, 51);
  &.router-link-exact-active {
    color: #42b983;
  }
}

.c-text {
  padding: 0 20% 0 20%;
}
</style>

<style scoped lang="scss"></style>
