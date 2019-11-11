<template>
  <div id="app-game-board">
    <component :is="getGameBoardComponentName()"></component>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { CGame } from "@/classes/CGame";
import GTenRegular from "@/components/gameBoards/GTenRegular.vue";

@Component({
  components: {
    GTenRegular
  }
})
export default class GameBoard extends Vue {
  @Watch("$store.getters.loadingStatus")
  getGameBoardComponentName() {
    if (!this.$store.getters.loadingStatus) {
      const gameId: string = this.$store.getters.gameId;
      const variantId: string = this.$store.getters.variantId;
      return (
        "G" +
        gameId[0].toUpperCase() +
        gameId.slice(1) +
        variantId[0].toUpperCase() +
        variantId.slice(1)
      );
    }
    return "";
  }
}
</script>
