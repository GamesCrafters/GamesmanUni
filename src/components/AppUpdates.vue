<template>
  <div id="app-updates">
    <h2 id="app-updates-title">What's new!?</h2>
    <div id="app-updates-warning">
      If latest version listed here does not match
      <code>GamesmanUniGUI</code> version in footer, new content is available.
      Please try refreshing the page ( <code>ctrl/command + r</code>) to get
      latest patches and updates.
    </div>
    <a
      class="app-updates-commit-link"
      v-for="n in latestCommitCount"
      :key="n"
      :href="latestCommitLinkArray[n - 1]"
      target="_blank"
      rel="noreferrer"
    >
      <div class="app-updates-commit-version">
        {{ latestCommitVersionArray[n - 1] }}
      </div>
      <div class="app-updates-commit-message">
        {{ latestCommitMessageArray[n - 1] }}
      </div>
    </a>
    <a
      id="app-updates-more"
      href="https://github.com/GamesCrafters/GamesmanUni/commits/master"
      target="_blank"
      rel="noreferrer"
      >For complete update history...</a
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppUpdates extends Vue {
  get latestCommitCount(): number {
    return this.$store.getters.latestCommitCount;
  }

  get latestCommitVersionArray(): Array<string> {
    return this.$store.getters.latestCommitVersionArray;
  }

  get latestCommitMessageArray(): Array<string> {
    return this.$store.getters.latestCommitMessageArray;
  }

  get latestCommitLinkArray(): Array<string> {
    return this.$store.getters.latestCommitLinkArray;
  }

  created(): void {
    this.$store.dispatch("initCommits");
  }
}
</script>

<style lang="scss" scoped>
#app-updates-warning {
  border: 0.04em solid var(--neutralColor);
  border-radius: 0.25em;
  font-style: italic;
  line-height: 1.5em;
  margin: 0 20%;
  padding: 2em;
}

.app-updates-commit-link {
  border: 0.04em solid var(--neutralColor);
  border-radius: 0.25em;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 20%;
  padding: 0 0.25em;
  text-decoration: none;
  > * {
    line-height: 1.5em;
    margin: 0 0.25em;
    padding: 0 0.25em;
    text-align: left;
  }
}

.app-updates-commit-version {
  flex: 1 1 0;
  font-weight: bold;
}

.app-updates-commit-message {
  flex: 2 1 0;
}

#app-updates-more {
  border: 0.04em solid var(--neutralColor);
  border-radius: 0.25em;
  display: block;
  font-style: italic;
  font-weight: normal;
  line-height: 1.5em;
  margin: 0 20%;
  padding: 2em;
  text-decoration: none;
}
</style>
