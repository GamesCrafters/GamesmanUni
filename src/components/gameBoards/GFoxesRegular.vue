<template>
  <div id="app-game-board-foxgee-regular">
    <!-- offset, dimensions -->
    <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- defines pieces -->
        <g id="board">
          <!-- <pattern id="board-bar">
          </pattern> -->

          <!-- below is line from 1, 1 to 81, 1 -->
          <path id="board-bar" d="M1,1 L81,1" />
          <use xlink:href="#board-bar" transform="translate(0 10)" />
          <use xlink:href="#board-bar" transform="translate(0 20)" />
          <use xlink:href="#board-bar" transform="translate(0 30)" />
          <use xlink:href="#board-bar" transform="translate(0 40)" />
          <use xlink:href="#board-bar" transform="translate(0 50)" />
          <use xlink:href="#board-bar" transform="translate(0 60)" />
          <use xlink:href="#board-bar" transform="translate(0 70)" />
          <use xlink:href="#board-bar" transform="translate(0 80)" />
          <use xlink:href="#board-bar" transform="translate(2) rotate(90)" />
          <use xlink:href="#board-bar" transform="translate(12) rotate(90)" />
          <use xlink:href="#board-bar" transform="translate(22) rotate(90)" />
          <use xlink:href="#board-bar" transform="translate(32) rotate(90)" />
          <use xlink:href="#board-bar" transform="translate(42) rotate(90)" />
          <use xlink:href="#board-bar" transform="translate(52) rotate(90)" />
          <use xlink:href="#board-bar" transform="translate(62) rotate(90)" />
          <use xlink:href="#board-bar" transform="translate(72) rotate(90)" />
          <use xlink:href="#board-bar" transform="translate(82) rotate(90)" />
        </g>
        <circle id="turn-0-token" cx="5" cy="5" r="2" />
        <circle id="turn-1-token" cx="5" cy="5" r="2" />
        <circle id="hint" cx="1" cy="1" r="2.5" />
        <rect id="move" x="1" y="1" width="20" height="20" />
      </defs>

      <use xlink:href="#board" x="0" y="0" />
      <g v-for="cell in cellCount" :key="cell">
        <use v-if="cell === 1" />
        <use
          v-else-if="boardData[cell].token === 'G' && (cell - 2) % 8 < 4"
          xlink:href="#turn-0-token"
          :x="(((cell - 2) * 2) % 8) * 10 + 11"
          :y="Math.floor(((cell - 2) * 2) / 8) * 10 + 1"
        />
        <use
          v-else-if="boardData[cell].token === 'G' && (cell - 2) % 8 > 3"
          xlink:href="#turn-0-token"
          :x="(((cell - 2) * 2) % 8) * 10 + 1"
          :y="Math.floor(((cell - 2) * 2) / 8) * 10 + 1"
        />
        <use
          v-else-if="boardData[cell].token === 'F' && (cell - 2) % 8 < 4"
          xlink:href="#turn-1-token"
          :x="(((cell - 2) * 2) % 8) * 10 + 11"
          :y="Math.floor(((cell - 2) * 2) / 8) * 10 + 1"
        />
        <use
          v-else-if="boardData[cell].token === 'F' && (cell - 2) % 8 > 3"
          xlink:href="#turn-1-token"
          :x="(((cell - 2) * 2) % 8) * 10 + 1"
          :y="Math.floor(((cell - 2) * 2) / 8) * 10 + 1"
        />

        <g>
          <!-- for hints: fix coords to alternate -->
          <use
            v-if="boardData[cell].hint"
            :class="'hint-' + boardData[cell].hint"
            xlink:href="#hint"
            :x="(((cell - 2) * 2) % 8) * 10 + 11"
            :y="Math.floor(((cell - 2) * 2) / 8) * 10 + 1"
          />
          <!-- change runMove to have correctly formatted argument
          not sure if cell.toString() is the correct arg for backend to process -->
          <use
            :class="remoteness && 'move-pointer'"
            @click="remoteness && runMove(cell.toString())"
            xlink:href="#move"
            :x="(((cell - 2) * 2) % 8) * 10 + 1"
            :y="Math.floor(((cell - 2) * 2) / 8) * 10 + 1"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class GFoxesRegular extends Vue {
  cellCount: number = 33;

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
document.write(nextMoveDataArray());
</script>

<style lang="scss" scoped>
svg {
  height: 15em;
  width: 15em;
  margin: auto;
  vertical-align: middle;
  > * {
    fill: none;
    stroke: var(--neutralColor);
    stroke-width: 2;
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
