<template>
  <div class="ftz app-game">
    <p class="ftz app-game-board">Board: {{ game.round.board }}</p>
    <div class="ftz app-game-moves">
      <button
        id="ftz-move-1"
        class="ftz app-game-move"
        @click="runMove1"
        :class="[move1PositionValue]"
      >
        take one
      </button>
      <button
        id="ftz-move-2"
        class="ftz app-game-move"
        @click="runMove2"
        :class="[move2PositionValue]"
      >
        take two
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class FTZ extends Vue {
  get game() {
    return this.$store.getters.game;
  }

  get move1PositionValue() {
    return this.$store.getters.nextMovePositionValue("1");
  }

  get move2PositionValue() {
    return this.$store.getters.nextMovePositionValue("2");
  }

  runMove1() {
    this.$store.dispatch("runRound", "1");
  }

  runMove2() {
    this.$store.dispatch("runRound", "2");
  }
}
</script>
