<template>
  <div id="app-game-board-default">
    <p id="app-game-board-default-position">
      <b>Position</b>
    </p>
    <pre><code>{{ game.getRound().getPosition() }}</code></pre>
    <p id="app-game-board-default-moves">
      <b>Move(s)</b>
      <br />
      <button
        v-for="nextMoveData in game.getRound().getNextMoveDataArray()"
        :key="nextMoveData.move"
        :class="`c-${nextMoveData.moveValue}`"
        @click="runMove(nextMoveData.move)"
      >
        {{ nextMoveData.move }}
      </button>
    </p>
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
