<template>
  <div id="app-game-board-ttt-regular">
    <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <g id="board">
          <path id="board-bar" d="M1,22 L65,22" />
          <use xlink:href="#board-bar" transform="translate(0 22)" />
          <use xlink:href="#board-bar" transform="translate(44) rotate(90)" />
          <use xlink:href="#board-bar" transform="translate(66) rotate(90)" />
        </g>
        <g id="turn-0-token">
          <path id="cross-bar" d="M3,3 L19,19" />
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
            v-if="nextMovesVisibility && boardData[cell].hint"
            :class="getHintClass(boardData[cell].hint)"
            :style="{
              opacity: deltaRemotenessVisibility
                ? boardData[cell].hintOpacity
                : 1
            }"
            xlink:href="#hint"
            :x="((cell - 1) % 3) * 22"
            :y="Math.floor((cell - 1) / 3) * 22"
          />
          <use
            :class="remoteness && 'move-pointer'"
            @click="remoteness && runMove(boardData[cell].move)"
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
import { TMoveData } from "@/types/internal/TMoveData";
import { COptions } from "@/classes/COptions";

@Component
export default class GTttRegular extends Vue {
  cellCount: number = 9;
  boardData: {
    [cell: number]: { token: string; hint: string; hintOpacity: number };
  } = this.initBoardData();

  get loadingStatus(): boolean {
    return this.$store.getters.loadingStatus;
  }

  get options(): COptions {
    return this.$store.getters.options;
  }

  get roundNumber(): number {
    return this.$store.getters.roundNumber;
  }

  get position(): string {
    return this.$store.getters.position;
  }

  get remoteness(): number {
    return this.$store.getters.remoteness;
  }

  get nextMoveDataArray(): Array<TMoveData> {
    return this.$store.getters.nextMoveDataArray;
  }

  get nextMovesVisibility(): boolean {
    return this.$store.getters.nextMovesVisibility;
  }

  get deltaRemotenessVisibility(): boolean {
    return this.$store.getters.deltaRemotenessVisibility;
  }

  getHintClass(hint: string): string {
    if (this.$store.getters.hintVisibility) {
      return "hint-" + hint;
    }
    return "";
  }

  initBoardData(): {
    [cell: number]: { token: string; hint: string; hintOpacity: number };
  } {
    let boardData: {
      [cell: number]: {
        token: string;
        move: string;
        hint: string;
        hintOpacity: number;
      };
    } = {};
    for (let cell: number = 1; cell <= this.cellCount; cell++) {
      boardData[cell] = { token: "", move: "", hint: "", hintOpacity: 1 };
    }
    return boardData;
  }

  updateBoardData(): void {
    if (!this.loadingStatus) {
      this.boardData = this.initBoardData();
      for (let cell: number = 1; cell <= this.cellCount; cell++) {
        this.boardData[cell].token = this.position[7 + cell];
      }
      for (let nextMoveData of this.nextMoveDataArray) {
        Object.assign(this.boardData[+nextMoveData.move[4] + 1], {
          move: nextMoveData.move,
          hint: nextMoveData.moveValue,
          hintOpacity: nextMoveData.moveValueOpacity
        });
      }
    }
  }

  runMove(move: string): void {
    this.$store.dispatch("runMove", move);
  }

  created(): void {
    this.boardData = this.initBoardData();
  }

  mounted(): void {
    this.updateBoardData();
  }

  @Watch("loadingStatus")
  async onAsyncRoundChange(): Promise<void> {
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
