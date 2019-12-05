<template>
  <div id="app-game-board-ten-regular">
    <svg
      width="20em"
      height="20em"
      viewBox="0 0 86 86"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <g id="board">
          <path id="board-bar" d="M1,1 L85,1" />
          <use xlink:href="#board-bar" transform="translate(0 21)" />
          <use xlink:href="#board-bar" transform="translate(0 42)" />
          <use xlink:href="#board-bar" transform="translate(0 63)" />
          <use xlink:href="#board-bar" transform="translate(0 84)" />
          <use xlink:href="#board-bar" transform="translate(2) rotate(90)" />
          <use xlink:href="#board-bar" transform="translate(23) rotate(90)" />
          <use xlink:href="#board-bar" transform="translate(44) rotate(90)" />
          <use xlink:href="#board-bar" transform="translate(65) rotate(90)" />
          <use xlink:href="#board-bar" transform="translate(86) rotate(90)" />
        </g>
        <circle
          id="head"
          cx="11"
          cy="11"
          r="8"
          stroke="black"
          stroke-width="1"
          fill="blue"
        />
        <rect
          id="body"
          width="16"
          height="16"
          stroke="black"
          stroke-width="1"
          fill="green"
        />
        <circle
          id="tail"
          cx="11"
          cy="11"
          r="8"
          stroke="black"
          stroke-width="1"
          fill="red"
        />
        <circle id="hint" cx="11" cy="11" r="3" stroke="0" />
        <rect id="move" x="1" y="1" width="20" height="20" />
      </defs>
      <use xlink:href="#board" x="0" y="0" />
      <g v-for="cell in cellCount" :key="cell">
        <use
          v-if="boardData[cell].token === 'h'"
          xlink:href="#head"
          :x="((cell - 1) % 4) * 21 + 0.3"
          :y="Math.floor((cell - 1) / 4) * 21 + 0.3"
        />
        <use
          v-else-if="boardData[cell].token === 'b'"
          xlink:href="#body"
          :x="((cell - 1) % 4) * 21 + 3.5"
          :y="Math.floor((cell - 1) / 4) * 21 + 3.5"
        />
        <use
          v-else-if="boardData[cell].token === 't'"
          xlink:href="#tail"
          :x="((cell - 1) % 4) * 21 + 0.3"
          :y="Math.floor((cell - 1) / 4) * 21 + 0.3"
        />
        <g v-else>
          <use
            v-if="boardData[cell].hint"
            :class="'hint-' + boardData[cell].hint"
            xlink:href="#hint"
            :x="((cell - 1) % 4) * 21"
            :y="Math.floor((cell - 1) / 4) * 21"
          />
          <use
            :class="remoteness && 'move-pointer'"
            @click="
              remoteness &&
                runMove('[' + referrHead + ' ' + cell.toString() + ']')
            "
            xlink:href="#move"
            :x="((cell - 1) % 4) * 21"
            :y="Math.floor((cell - 1) / 4) * 21"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { CRound } from "@/classes/CRound";

@Component
export default class GSnakeRegular extends Vue {
  cellCount: number = 16;
  boardData: {
    [cell: number]: { token: string; hint: string };
  } = this.initBoardData();
  referr: string = "";
  referrHead: string = "";
  get game() {
    return this.$store.getters.game;
  }

  runMove(move: string): void {
    this.$store.dispatch("runMove", move);
  }

  get loadingStatus() {
    return this.$store.getters.loadingStatus;
  }

  get roundNumber() {
    return this.$store.getters.roundNumber;
  }

  get position() {
    return this.$store.getters.position;
  }

  get remoteness() {
    return this.$store.getters.remoteness;
  }

  get nextMoveDataArray() {
    return this.$store.getters.nextMoveDataArray;
  }

  initBoardData(): { [cell: number]: { token: string; hint: string } } {
    let boardData: { [cell: number]: { token: string; hint: string } } = {};
    for (let cell: number = 1; cell <= this.cellCount; cell++) {
      boardData[cell] = { token: "", hint: "" };
    }
    return boardData;
  }

  updateBoardData(): void {
    if (!this.loadingStatus) {
      this.boardData = this.initBoardData();
      for (let cell: number = 1; cell <= this.cellCount; cell++) {
        this.boardData[cell].token = this.position[cell - 1];
      }
      var a = 111;
      for (let nextMoveData of this.nextMoveDataArray) {
        console.log(nextMoveData.move);
        // var referr = 0;
        if (nextMoveData.move[2] == " ") {
          this.referrHead = nextMoveData.move[1];
          if (nextMoveData.move[4] == "]") {
            this.referr = nextMoveData.move[3];
          } else {
            this.referr = nextMoveData.move[3] + nextMoveData.move[4];
          }
        } else {
          this.referrHead = nextMoveData.move[1] + nextMoveData.move[2];
          if (nextMoveData.move[5] == "]") {
            this.referr = nextMoveData.move[4];
          } else {
            this.referr = nextMoveData.move[4] + nextMoveData.move[5];
          }
        }
        console.log(this.referr);
        console.log(this.referrHead);
        var index = +this.referr;
        if (this.boardData[index] != undefined) {
          this.boardData[index].hint = nextMoveData.moveValue;
          console.log(a);
          console.log(this.boardData[index].hint);
          //a++;
        }
      }
    }
  }

  created() {
    this.boardData = this.initBoardData();
  }

  mounted() {
    this.updateBoardData();
  }

  @Watch("loadingStatus")
  onAsyncRoundChange(): void {
    !this.loadingStatus && this.updateBoardData();
  }

  @Watch("roundNumber")
  onSyncRoundChange(): void {
    this.updateBoardData();
  }
}
</script>

<style lang="scss" scoped>
svg {
  > * {
    fill: none;
    stroke: var(--primaryColor);
    stroke-width: 1;
  }
}

#turn- {
  &0-token {
    stroke: var(--turn0Color);
  }
  &1-token {
    stroke: var(--turn1Color);
  }
}

.hint- {
  &win {
    fill: var(--winColor);
    stroke: var(--winColor);
  }
  &draw {
    fill: var(--drawColor);
    stroke: var(--drawColor);
  }
  &tie {
    fill: var(--tieColor);
    stroke: var(--tieColor);
  }
  &lose {
    fill: var(--loseColor);
    stroke: var(--loseColor);
  }
}

#move {
  fill: var(--backgroundColor);
  fill-opacity: 0;
  stroke-opacity: 0;
}

.move-pointer {
  cursor: pointer;
}
</style>
