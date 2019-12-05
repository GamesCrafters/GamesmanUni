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
        <g id="turn-0-token">
          <path id="cross-bar" d="M5.343,16.657 L16.657,5.343" />
          <use xlink:href="#cross-bar" transform="translate(22) rotate(90)" />
        </g>
        <circle id="turn-1-token" cx="11" cy="11" r="8" />
        <circle id="hint" cx="11" cy="11" r="1" />
        <rect id="move" x="1" y="1" width="20" height="20" />
      </defs>
      <use xlink:href="#board" x="0" y="0" />
      <g v-for="cell in cellCount" :key="cell">
        <use
          v-if="boardData[cell].token === 'x'"
          xlink:href="#turn-0-token"
          :x="((cell - 1) % 3) * 22"
          :y="Math.floor((cell - 1) / 3) * 22"
        />
        <use
          v-else-if="boardData[cell].token === 'o'"
          xlink:href="#turn-1-token"
          :x="((cell - 1) % 3) * 22"
          :y="Math.floor((cell - 1) / 3) * 22"
        />
        <g v-else>
          <use
            v-if="boardData[cell].hint"
            :class="'hint-' + boardData[cell].hint"
            xlink:href="#hint"
            :x="((cell - 1) % 3) * 22"
            :y="Math.floor((cell - 1) / 3) * 22"
          />
          <use
            :class="remoteness && 'move-pointer'"
            @click="remoteness && runMove(cell.toString())"
            xlink:href="#move"
            :x="((cell - 1) % 3) * 22"
            :y="Math.floor((cell - 1) / 3) * 22"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class GSnakeRegular extends Vue {
  cellCount: number = 9;
  boardData: {
    [cell: number]: { token: string; hint: string };
  } = this.initBoardData();

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
      for (let nextMoveData of this.nextMoveDataArray) {
        this.boardData[+nextMoveData.move].hint = nextMoveData.moveValue;
      }
    }
  }

  runMove(move: string): void {
    this.$store.dispatch("runMove", move);
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
    stroke: var(--winColor);
  }
  &draw {
    stroke: var(--drawColor);
  }
  &tie {
    stroke: var(--tieColor);
  }
  &lose {
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
