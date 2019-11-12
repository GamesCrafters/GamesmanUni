<template>
  <div #app-game-board-ten-regular></div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { CRound } from "@/classes/CRound";

@Component
export default class GTenRegular extends Vue {
  cellCount: number = 11;
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
      let rounds: Array<CRound> = this.$store.getters.roundArray;
      let round: CRound = this.$store.getters.round;
      for (
        let roundNumber: number = 0;
        roundNumber < round.getRoundNumber();
        roundNumber++
      ) {
        if (
          rounds[roundNumber].getMove() != "" &&
          roundNumber != round.getRoundNumber() - 1
        ) {
          this.boardData[
            rounds[roundNumber + 1].getPosition()
          ].piece = `c-turn-piece-${rounds[roundNumber].getTurnId()}`;
        }
      }
      for (let nextMoveData of round.getNextMoveDataArray()) {
        const move = nextMoveData.move;
        const moveValue =
          this.$store.getters.nextMoveDataDictionary.get(move).moveValue ||
          "none";
        this.boardData[nextMoveData.position].move = move;
        this.boardData[nextMoveData.position].hint = `c-hint-${moveValue}`;
        this.boardData[nextMoveData.position].clickable = true;
      }
    }
  }

  runMove(move: string): void {
    this.$store.dispatch("runMove", move);
  }
}
</script>
