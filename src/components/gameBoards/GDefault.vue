<template>
  <div id="app-game-board-default">
    <div id="app-game-board-default-position">
      <h3 id="app-game-board-default-position-title">Position</h3>
      <pre><code>{{ game.getRound().getPosition() }}</code></pre>
    </div>
    <hr class="c-divider" />
    <div id="app-game-board-default-moves">
      <h3 id="app-game-board-default-moves-title">Move(s)</h3>
      <div id="app-game-board-default-moves-buttons">
        <button
          :class="`c-${nextMoveData.moveValue}`"
          v-for="nextMoveData in game.getRound().getNextMoveDataArray()"
          :key="nextMoveData.move"
          @click="runMove(nextMoveData.move)"
        >
          {{ nextMoveData.move }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { CRound } from "@/classes/CRound";

@Component
export default class GDefault extends Vue {
  get game() {
    return this.$store.getters.game;
  }

  runMove(move: string): void {
    this.$store.dispatch("runMove", move);
  }
}
</script>

<style lang="scss" scoped>
#app-game-board-default-moves-buttons {
  padding: 0 20%;
}
</style>
