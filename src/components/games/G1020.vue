<template>
  <table id="app-game-board">
    <tr v-for="i in cellCount" :key="i">
      <td
        @click="
          boardData[i - 1].clickable ? runMove(boardData[i - 1].move) : null
        "
      >
        <span :class="boardData[i - 1].piece">
          <span :class="boardData[i - 1].hint">
            {{ boardData[i - 1].board }}
          </span>
        </span>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { CRound } from "@/classes/CRound";
import { TMoveData } from "@/types/TMoveData";

@Component
export default class G1020 extends Vue {
  cellCount = 11;

  get loadingStatus() {
    return this.$store.getters.loadingStatus;
  }

  get game() {
    return this.$store.getters.game;
  }

  get boardData() {
    let boardData: {
      [cell: string]: {
        piece: string;
        hint: string;
        clickable: boolean;
        move: string;
        board: string;
      };
    } = {};

    for (let cell: number = 0; cell < this.cellCount; cell++) {
      boardData[cell.toString()] = {
        piece: "",
        hint: "",
        clickable: false,
        move: "",
        board: cell.toString()
      };
    }

    if (!this.loadingStatus) {
      let rounds: Array<CRound> = this.$store.getters.rounds;
      let round: CRound = this.$store.getters.round;
      for (
        let roundNumber: number = 0;
        roundNumber < round.roundNumber;
        roundNumber++
      ) {
        if (rounds[roundNumber].move != "") {
          boardData[
            rounds[roundNumber + 1].board
          ].piece = `c-turn-piece-${rounds[roundNumber].turnNumber}`;
        }
      }

      for (let nextMoveData of round.nextMoveDatas) {
        let move = nextMoveData.move;
        let moveValue = this.$store.getters.moveValue(move);
        boardData[nextMoveData.board].move = move;
        boardData[nextMoveData.board].hint = `c-hint-${moveValue}`;
        boardData[nextMoveData.board].clickable = true;
      }
    }
    return boardData;
  }

  runMove(move: string): void {
    this.$store.dispatch("runRound", move);
  }
}
</script>
