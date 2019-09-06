<template>
  <div id="app">
    <CHeader></CHeader>
    <hr class="c-divider" />
    <router-view />
    <hr class="c-divider" />
    <CFooter></CFooter>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { App } from "@/classes/App";
import CHeader from "@/components/CHeader.vue";
import CFooter from "@/components/CFooter.vue";

@Component({
  components: {
    CHeader,
    CFooter
  }
})
export default class VApp extends Vue {
  app: App = new App();

  mounted() {
    this.$store.dispatch("initApp");
  }
}
</script>

<style lang="scss">
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

.c-link-router {
  font-weight: bold;
  color: rgb(41, 44, 51);
  &.router-link-exact-active {
    color: #42b983;
  }
}

.c-text {
  padding: 0 20% 0 20%;
}

.c-code-inline {
  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border: 1px solid #bcbec0;
  padding: 2px;
  font: 12px Monaco, Consolas, "Andale  Mono", "DejaVu Sans Mono", monospace;
}
</style>

<style scoped lang="scss"></style>
