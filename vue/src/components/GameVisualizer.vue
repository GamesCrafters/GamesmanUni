<template>
  <div id="app-game-visualizer">
    <h3 id="app-game-visualizer-title">Game Visualizer</h3>
    <canvas :id="visualizerSelectorId"></canvas>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { CVisualizer } from "@/classes/CVisualizer";

@Component
export default class GameVisualizer extends Vue {
  visualizerSelectorId = this.$store.getters.visualizerSelectorId;

  drawVisualizer() {
    const visualizer = new CVisualizer(this.$store.getters.game);
    visualizer.drawVisualizer();
  }

  @Watch("$store.getters.loadingStatus")
  onRoundChange() {
    !this.$store.getters.loadingStatus && this.drawVisualizer();
  }
}
</script>
