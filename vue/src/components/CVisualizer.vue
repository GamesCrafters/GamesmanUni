<template>
  <div id="app-game-visualizer">
    <h3 id="app-game-visualizer-title">Game Visualizer</h3>
    <canvas id="app-game-visualizer-canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Visualizer } from "@/classes/Visualizer";

@Component
export default class CVisualizer extends Vue {
  canvasSelector: string = "app-game-visualizer-canvas";

  mounted() {
    let visualizer = new Visualizer(
      this.$store.getters.history,
      this.canvasSelector
    );
    visualizer.setCanvas();
  }

  @Watch("$store.getters.round")
  onRoundChange() {
    let visualizer = new Visualizer(
      this.$store.getters.history,
      this.canvasSelector
    );
    visualizer.setCanvas();
  }
}
</script>

<style scoped lang="scss"></style>
