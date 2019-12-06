<template>
  <div id="app-game-board-dnb-regular">
    <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- <g id="line">
          <line x1="5" y1="5" x2="33" y2="5" stroke="black" width="1"/>
        </g> -->
        <g id="board">
          <!-- <g id="line"> -->
          <line
            id="line"
            x1="5"
            y1="5"
            x2="33"
            y2="5"
            stroke="black"
            width="0.5"
          />
          <use xlink:hrer="#line" transform="(0" 30) />
          <!-- </g> -->
          <circle id="dot" cx="5" cy="5" r="1" />
          <use xlink:href="#dot" transform="translate(0 28)" />
          <use xlink:href="#dot" transform="translate(0 56)" />
          <use xlink:href="#dot" transform="translate(28 0)" />
          <use xlink:href="#dot" transform="translate(28 28)" />
          <use xlink:href="#dot" transform="translate(28 56)" />
          <use xlink:href="#dot" transform="translate(56 0)" />
          <use xlink:href="#dot" transform="translate(56 28)" />
          <use xlink:href="#dot" transform="translate(56 56)" />
        </g>
        <!-- then make copies horizonatlly, and vertically -->
        <g id="turn-0-token">
          <path id="cross-bar" d="M3,3 L19,19" />
          <use xlink:href="#cross-bar" transform="translate(22) rotate(90)" />
        </g>
        <circle id="turn-1-token" cx="11" cy="11" r="8" />
        <circle id="hint" cx="11" cy="11" r="1" />
        <rect id="move" x="1" y="1" width="20" height="20" />
      </defs>
      <!-- use a for loop to put lines on the board.
      Also make dots and have the use tag for those -->
      <use xlink:href="#board" x="0" y="0" />
      <!-- <use xlink:href="#line" x="0" y="0" /> -->
      <!-- <g v-for="line in lineCount" :key="line">
        <use
          v-if="boardData[line].token === 'x'"
          xlink:href="#turn-0-token"
          :x="((line - 1) % 2) * 33"
          :y="Math.floor((line - 1) / 2) * 33"
        />
        <use
          v-else-if="boardData[line].token === 'o'"
          xlink:href="#turn-1-token"
          :x="((line - 1) % 2) * 33"
          :y="Math.floor((line - 1) / 2) * 33"
        />
        <g v-else>
          <use
            v-if="boardData[line].hint"
            :class="'hint-' + boardData[line].hint"
            xlink:href="#hint"
            :x="((line - 1) % 2) * 33"
            :y="Math.floor((line - 1) / 2) * 33"
          />
          <use
            :class="remoteness && 'move-pointer'"
            @click="remoteness && runMove(line.toString())"
            xlink:href="#move"
            :x="((line - 1) % 2) * 33"
            :y="Math.floor((line - 1) / 2) * 33"
          />
        </g>
      </g> -->
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class GDnbRegular extends Vue {
  lineCount = 12;
  boardData: {
    [line: number]: { token: string; hint: string };
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

  initBoardData(): { [line: number]: { token: string; hint: string } } {
    let boardData: { [line: number]: { token: string; hint: string } } = {};
    for (let line: number = 1; line <= this.lineCount; line++) {
      boardData[line] = { token: "", hint: "" };
    }
    return boardData;
  }

  updateBoardData(): void {
    if (!this.loadingStatus) {
      this.boardData = this.initBoardData();
      for (let line: number = 1; line <= this.lineCount; line++) {
        this.boardData[line].token = this.position[line - 1];
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
