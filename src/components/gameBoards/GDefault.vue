<template>
  <div id="app-game-board-default">
    <div id="app-game-board-default-position">
      <h3 id="app-game-board-default-position-title">Position</h3>
      <pre id="app-game-board-default-position-value">{{ position }}</pre>
    </div>
    <hr v-if="nextMovesVisibility" class="c-divider" />
    <div v-if="nextMovesVisibility" id="app-game-board-default-moves">
      <h3 id="app-game-board-default-moves-title">Move(s)</h3>
      <div id="app-game-board-default-moves-buttons">
        <button
          v-for="nextMoveData in nextMoveDataArray"
          :key="nextMoveData.move"
          :class="getHintClass(nextMoveData.moveValue)"
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
import { TMoveData } from "@/types/internal/TMoveData";
import { CRound } from "@/classes/CRound";

@Component
export default class GDefault extends Vue {
  get position(): string {
    let position: string = this.$store.getters.position;
    position = position.replace(/^;/, "");
    position = position.replace(/;$/, "");
    position = position.replace(/;/g, "\n");
    position = position.replace(/=/g, " = ");
    return position;
  }

  get nextMoveDataArray(): Array<TMoveData> {
    return this.$store.getters.nextMoveDataArray;
  }

  get nextMovesVisibility(): boolean {
    return this.$store.getters.nextMovesVisibility;
  }

  getHintClass(moveValue: string): string {
    if (this.$store.getters.hintVisibility) {
      return "c-" + moveValue;
    }
    return "";
  }

  runMove(move: string): void {
    this.$store.dispatch("runMove", move);
  }
}
</script>

<style lang="scss" scoped>
#app-game-board-default-position-value {
  border: 0.04em solid var(--neutralColor);
  border-radius: 0.25em;
  display: inline-block;
  padding: 0.5em;
}

#app-game-board-default-moves-buttons {
  padding: 0 20%;
}
</style>
