<template>
  <div id="app-game-ftz">
    <p id="app-game-ftz-board">Board: {{ currentGame.round.board }}</p>
    <div id="app-game-ftz-moves">
      <button id="app-game-ftz-move-1" @click="runMove1" :class="[move1Value]">
        take one
      </button>
      <button id="app-game-ftz-move-2" @click="runMove2" :class="[move2Value]">
        take two
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Game } from "@/classes/Game";

@Component
export default class CFTZ extends Vue {
  get currentGame() {
    return this.$store.getters.currentGame;
  }

  get move1Value() {
    if (!this.isValidMove("1")) {
      return "none";
    }
    return this.$store.getters.nextMoveValuesData.getNextMoveValue("1");
  }

  get move2Value() {
    if (!this.isValidMove("2")) {
      return "none";
    }
    return this.$store.getters.nextMoveValuesData.getNextMoveValue("2");
  }

  runMove1() {
    this.$store.dispatch("setStatus", 0);
    this.$store.dispatch("makeMove", "1");
  }

  runMove2() {
    this.$store.dispatch("setStatus", 0);
    this.$store.dispatch("makeMove", "2");
  }

  @Watch("$store.getters.status")
  onReady() {
    if (this.$store.getters.status == 1) {
      if (this.isValidMove("1")) {
        (document.getElementById(
          "app-game-ftz-move-1"
        ) as HTMLInputElement).disabled = false;
      }
      if (this.isValidMove("2")) {
        (document.getElementById(
          "app-game-ftz-move-2"
        ) as HTMLInputElement).disabled = false;
      }
    } else {
      (document.getElementById(
        "app-game-ftz-move-1"
      ) as HTMLInputElement).disabled = true;
      (document.getElementById(
        "app-game-ftz-move-2"
      ) as HTMLInputElement).disabled = true;
    }
  }

  isValidMove(move: string) {
    if (
      this.currentGame.round.getRoundNumber() == 1 ||
      (this.currentGame.round.getRoundNumber() > 1 &&
        this.currentGame.round.nextMoveValues.exists(move))
    ) {
      return true;
    }
    return false;
  }
}
</script>

<style scoped lang="scss">
.win {
  background-color: green;
}

.tie {
  background-color: yellow;
}

.lose {
  background-color: red;
}

.none {
  background-color: white;
}
</style>
