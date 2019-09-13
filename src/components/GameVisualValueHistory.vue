<template>
  <div id="app-game-visual-value-history">
    <h3 id="app-game-visual-value-history-title">Visual Value History</h3>
    <canvas :id="visualValueHistorySelectorId"></canvas>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { CVisualValueHistory } from "@/classes/CVisualValueHistory";

@Component
export default class GameVisualValueHistory extends Vue {
  visualValueHistorySelectorId = this.$store.getters
    .visualValueHistorySelectorId;

  drawVisualValueHistory() {
    const visualValueHistory = new CVisualValueHistory(
      this.$store.getters.game
    );
    visualValueHistory.drawVisualValueHistory();
  }

  @Watch("$store.getters.loadingStatus")
  onRoundChange() {
    !this.$store.getters.loadingStatus && this.drawVisualValueHistory();
  }
}
</script>
