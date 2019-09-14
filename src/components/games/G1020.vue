<template>
  <table id="app-game-board">
    <tr v-for="i in cellCount" :key="i">
      <td
        @click="
          boardData[cellCount - i].clickable
            ? runMove(boardData[cellCount - i].move)
            : null
        "
      >
        <span :class="boardData[cellCount - i].piece">
          <span :class="boardData[cellCount - i].hint">
            {{ boardData[cellCount - i].board }}
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
  boardData: {
    [cell: string]: {
      piece: string;
      hint: string;
      clickable: boolean;
      move: string;
      board: string;
    };
  } = this.initBoardData();

  get loadingStatus() {
    return this.$store.getters.loadingStatus;
  }

  get game() {
    return this.$store.getters.game;
  }

  initBoardData() {
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
    return boardData;
  }

  created() {
    this.boardData = this.initBoardData();
  }

  mounted() {
    this.updateBoardData();
  }

  @Watch("$store.getters.loadingStatus")
  updateBoardData() {
    if (!this.loadingStatus) {
      this.boardData = this.initBoardData();
      let rounds: Array<CRound> = this.$store.getters.rounds;
      let round: CRound = this.$store.getters.round;
      for (
        let roundNumber: number = 0;
        roundNumber < round.roundNumber;
        roundNumber++
      ) {
        if (
          rounds[roundNumber].move != "" &&
          roundNumber != round.roundNumber - 1
        ) {
          this.boardData[
            rounds[roundNumber + 1].board
          ].piece = `c-turn-piece-${rounds[roundNumber].turnNumber}`;
        }
      }

      for (let nextMoveData of round.nextMoveDatas) {
        let move = nextMoveData.move;
        let moveValue = this.$store.getters.moveValue(move);
        this.boardData[nextMoveData.board].move = move;
        this.boardData[nextMoveData.board].hint = `c-hint-${moveValue}`;
        this.boardData[nextMoveData.board].clickable = true;
      }
    }
  }

  runMove(move: string): void {
    this.$store.dispatch("runRound", move);
  }
}
</script>
