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
import { CVvh } from "@/classes/CVvh";

@Component
export default class GameVvh extends Vue {
  vvhSelectorId: string = this.$store.getters.vvhSelectorId;

  @Watch("$store.getters.loadingStatus")
  onRoundChange(): void {
    !this.$store.getters.loadingStatus && this.$store.commit("drawVvh");
  }
}
</script>

<style scoped lang="scss">
#app-game-vvh {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  align-content: stretch;
}

#app-game-vvh-title {
  margin: 0;
}

#app-game-vvh-colorGuide {
  > * {
    border-radius: 100%;
    margin: 0 0.5em;
    padding: 0 1.5em;
  }
}
</style>
