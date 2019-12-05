<template>
  <div id="app-game-vvh">
    <h3 id="app-game-vvh-title">Visual Value History</h3>
    <div id="app-game-vvh-colorGuide">
      <span id="app-game-vvh-colorGuide-win" class="c-win">win</span>
      <span id="app-game-vvh-colorGuide-draw" class="c-draw">draw</span>
      <span id="app-game-vvh-colorGuide-tie" class="c-tie">tie</span>
      <span id="app-game-vvh-colorGuide-lose" class="c-lose">lose</span>
    </div>
    <div id="app-game-vvh-canvas-container">
      <canvas :id="vvhSelectorId"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { CVvh } from "@/classes/CVvh";
@Component
export default class GameVvh extends Vue {
  vvhSelectorId: string = this.$store.getters.vvhSelectorId;
  @Watch("$store.getters.loadingStatus")
  onAsyncRoundChange(): void {
    !this.$store.getters.loadingStatus && this.$store.commit("drawVvh");
  }
  @Watch("$store.getters.roundNumber")
  onSyncRoundChange(): void {
    this.$store.commit("drawVvh");
  }
  @Watch("$store.getters.theme")
  onThemeChange(): void {
    this.$store.commit("drawVvh");
  }
}
</script>

<style scoped lang="scss">
#app-game-vvh {
  border: 0.04em solid var(--neutralColor);
  border-radius: 0.25em;
  margin: 0;
  padding: 0.25em;
}
#app-game-vvh-colorGuide {
  margin: 0.25em;
  padding: 0.25em;
  > * {
    border-radius: 100%;
    margin: 0 0.5em;
    padding: 0 1.5em;
  }
}
#app-game-vvh-canvas {
  margin: 0.25em;
  padding: 0.25em;
}
@media only screen and (max-width: 53.625em) {
  #app-game-vvh {
    width: 25em;
    margin-left: auto;
    margin-right: auto;
    min-width: 0;
  }
  #app-game-vvh-canvas-container {
    margin: 0.25em;
    padding: 0.25em;
    margin-left: auto;
    margin-right: auto;
    overflow-x: scroll;
  }
}
</style>
