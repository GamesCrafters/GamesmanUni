<template>
  <div id="app-game-vvh">
    <h3 id="app-game-vvh-title">Visual Value History</h3>
    <p id="app-game-vvh-colorGuide">
      <span id="app-game-vvh-colorGuide-win" class="c-win-rev">win</span>
      <span id="app-game-vvh-colorGuide-draw" class="c-draw-rev">draw</span>
      <span id="app-game-vvh-colorGuide-tie" class="c-tie-rev">tie</span>
      <span id="app-game-vvh-colorGuide-lose" class="c-lose-rev">lose</span>
    </p>
    <canvas :id="vvhSelectorId"></canvas>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
// import { CVvh } from "@/classes/CVvh";

@Component
export default class GameVvh extends Vue {
  vvhSelectorId: string = this.$store.getters.vvhSelectorId;

  @Watch("$store.getters.loadingStatus")
  onRoundChange(): void {
    // !this.$store.getters.loadingStatus && this.$store.dispatch("drawVvh");
  }
}
</script>
