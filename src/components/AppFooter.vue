<template>
  <div id="app-footer">
    <span id="app-footer-frontend-version"
      ><a
        href="https://github.com/GamesCrafters/GamesmanUni"
        target="_blank"
        rel="noreferrer"
        >GamesmanUni</a
      >
      v{{ appVersion }}</span
    >
    |
    <span id="app-footer-backend-version"
      ><a
        href="https://github.com/GamesCrafters/GamesCraftersUWAPI"
        target="_blank"
        rel="noreferrer"
        >GamesCraftersUWAPI</a
      >
      v{{ dataVersion }}</span
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
    <span id="app-footer-unidoc">
      <a
        href="https://sites.google.com/berkeley.edu/gamesmanuni-doc"
        target="_blank"
        rel="noreferrer"
        >Documentation</a
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
  get appVersion(): string {
    return this.$store.getters.appVersion;
  }

  get dataVersion(): string {
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
