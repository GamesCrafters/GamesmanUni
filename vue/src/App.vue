<template>
  <div id="app">
    <Header></Header>
    <hr class="c-divider" />
    <router-view />
    <hr class="c-divider" />
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/app/Header.vue";
import Footer from "@/components/app/Footer.vue";

@Component({
  components: {
    Header,
    Footer
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
// @import "styles";
// add global style for buttons

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

.c-inline-code {
  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border: 1px solid #bcbec0;
  padding: 2px;
  font: 12px Monaco, Consolas, "Andale  Mono", "DejaVu Sans Mono", monospace;
}
</style>

<style scoped lang="scss"></style>
