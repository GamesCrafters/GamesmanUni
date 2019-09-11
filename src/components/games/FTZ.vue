<template>
  <div class="ftz app-game">
    <p class="ftz app-game-board">Board: {{ game.round.board }}</p>
    <div class="ftz app-game-moves">
      <button
        id="ftz-move-1"
        class="ftz app-game-move"
        @click="runMove('1')"
        :class="moveValue('1')"
        :disabled="isInvalidMove('1')"
      >
        take one
      </button>
      <button
        id="ftz-move-2"
        class="ftz app-game-move"
        @click="runMove('2')"
        :class="moveValue('2')"
        :disabled="isInvalidMove('2')"
      >
        take two
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class FTZ extends Vue {
  get loadingStatus() {
    return this.$store.getters.loadingStatus;
  }

  get game() {
    return this.$store.getters.game;
  }

  runMove(move: string) {
    this.$store.dispatch("runRound", move);
  }

  moveValue(move: string): string {
    if (!this.loadingStatus) {
      return "c-" + this.$store.getters.moveValue(move);
    }
    return "c-";
  }

  isInvalidMove(move: string) {
    const loadingStatus = this.loadingStatus;
    const moveValue = this.moveValue(move);
    if (this.loadingStatus || this.moveValue(move) === "c-") {
      return true;
    }
  }
}
</script>
