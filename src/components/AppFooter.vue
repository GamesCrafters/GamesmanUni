<template>
  <div id="app-footer">
    <span id="app-footer-frontend-version"
      >GamesmanUniGUI v{{ appVersion }}</span
    >
    |
    <span id="app-footer-backend-version"
      >GamesmanUniversalAPI v{{ dataVersion }}</span
    >
    |
    <span id="app-footer-github">
      <a
        href="https://github.com/GamesCrafters/GamesmanUni"
        target="_blank"
        rel="noreferrer"
        >GitHub</a
      >
    </span>
    |
    <span id="app-footer-copyright">
      ©
      <a
        href="http://gamescrafters.berkeley.edu/"
        target="_blank"
        rel="noreferrer"
        >GamesCrafters</a
      >
      and
      <a
        href="https://regents.universityofcalifornia.edu/"
        target="_blank"
        rel="noreferrer"
        >UC Regents</a
      >
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppFooter extends Vue {
  get appVersion() {
    return this.$store.getters.appVersion;
  }

  get dataVersion() {
    return this.$store.getters.serverDataVersion;
  }
}
</script>

<style lang="scss" scoped>
#app-footer {
  font-size: 1em;
  line-height: 2em;
}
</style>
