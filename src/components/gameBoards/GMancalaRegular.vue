<template>
  <div id="app-game-board-mancala-regular">
    <svg viewBox="0 0 90 30" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <g id="board">
          <circle id="pocket" r="4" cx="16.875" cy="7.5" />
          <path id="store" d="M 1.625 7.5 L 1.625 22.5 A 4 4 180 0 0 9.625 22.5
                L 9.625 7.5 A 4 4 0 0 0 1.625 7.5" />
          <use xlink:href="#pocket" transform="translate(11.25)" />
          <use xlink:href="#pocket" transform="translate(22.5)" />
          <use xlink:href="#pocket" transform="translate(33.75)" />
          <use xlink:href="#pocket" transform="translate(45)" />
          <use xlink:href="#pocket" transform="translate(56.25)" />
          <use xlink:href="#pocket" transform="translate(0 15)" />
          <use xlink:href="#pocket" transform="translate(11.25 15)" />
          <use xlink:href="#pocket" transform="translate(22.5 15)" />
          <use xlink:href="#pocket" transform="translate(33.75 15)" />
          <use xlink:href="#pocket" transform="translate(45 15)" />
          <use xlink:href="#pocket" transform="translate(56.25 15)" />
          <use xlink:href="#store" transform="translate(78.75)" />
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
    </svg>

    <template v-if="richPositionData.type == GMancalaRegularPositionTypes.String">
      <hr v-if="nextMovesVisibility" class="c-divider" />
      <div v-if="nextMovesVisibility" id="app-game-board-default-moves">
        <h3 id="app-game-board-default-moves-title">Move(s)</h3>
        <div
          id="app-game-board-default-moves-buttons"
          v-if="!loadingStatus && nextMoveDataArray"
        >
          <button
            v-for="nextMoveData in nextMoveDataArray"
            :key="nextMoveData.move"
            :class="getMoveButtonHintClass(nextMoveData.moveValue)"
            :style="{
              opacity: deltaRemotenessVisibility
                ? nextMoveData.moveValueOpacity
                : 1
            }"
            @click="runMove(nextMoveData.move)"
          >
            {{ nextMoveData.move }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { TMoveData } from "@/types/internal/TMoveData";
import { CRound } from "@/classes/CRound";

enum GMancalaRegularPositionTypes {
  String,
  UWAPIRegular2D
}

enum UWAPITurn {
  A = "A",
  B = "B"
}

interface GMancalaRegularRegular2DMove {
  str: string; // UWAPI move string
  hint: string;
  hintOpacity: number;
}

interface GMancalaRegularRegular2DBoardCell {
  token: string;
  move?: GMancalaRegularRegular2DMove;
}

interface GMancalaRegularRegular2DBoardArrow {
  from: number;
  to: number;
  move: GMancalaRegularRegular2DMove;
}

type GMancalaRegularPosition =
  | {
      type: GMancalaRegularPositionTypes.String;
      str: string;
    }
  | {
      type: GMancalaRegularPositionTypes.UWAPIRegular2D;
      turn: UWAPITurn;
      rows: number;
      columns: number;
      board: GMancalaRegularRegular2DBoardCell[];
    };

@Component
export default class GMancalaRegular extends Vue {
  GMancalaRegularPositionTypes = GMancalaRegularPositionTypes;
  richPositionData = this.generateRichPositionData();

  generateRichPositionData(): GMancalaRegularPosition {
    let position: string = this.$store.getters.position;

    function makeDefaultStringPosition(): GMancalaRegularPosition {
      let str = position;
      str = str.replace(/^;/, "");
      str = str.replace(/;$/, "");
      str = str.replace(/;/g, "\n");
      str = str.replace(/=/g, " = ");
      return {
        type: GMancalaRegularPositionTypes.String,
        str
      };
    }

    let matches;
    if (
      (matches = position.match(
        /^R_(A|B)_([0-9]+)_([0-9]+)_([a-zA-Z0-9-]+)(?:_(.*))?$/
      ))
    ) {
      // Regular 2D position
      let board: GMancalaRegularRegular2DBoardCell[] = matches[4]
        .split("")
        .map(token => ({
          token
        }));
      if (!this.loadingStatus && this.nextMoveDataArray)
        this.nextMoveDataArray.forEach(nextMoveData => {
          const move = {
            str: nextMoveData.move,
            hint: nextMoveData.moveValue,
            hintOpacity: nextMoveData.moveValueOpacity
          };
          let matches;
          if (
            (matches = nextMoveData.move.match(/^A_([a-zA-Z0-9-])_([0-9]+)$/))
          ) {
            // Add a piece to the board
            const to = parseInt(matches[2]);
            board[to].token = matches[1];
            board[to].move = move;
          } else if (
            (matches = nextMoveData.move.match(/^M_([0-9]+)_([0-9]+)$/))
          ) {

          } else {
            console.error("NOTREACHED");
            // Fallback to string type position
            return makeDefaultStringPosition();
          }
        });
      return {
        type: GMancalaRegularPositionTypes.UWAPIRegular2D,
        turn: matches[1] == "A" ? UWAPITurn.A : UWAPITurn.B,
        rows: parseInt(matches[2]),
        columns: parseInt(matches[3]),
        board
      };
    } else {
      // Unrecognized position
      return makeDefaultStringPosition();
    }
  }

  updateRichPositionData(): void {
    this.richPositionData = this.generateRichPositionData();
  }

  get hintVisibility() {
    return this.$store.getters.hintVisibility;
  }

  get loadingStatus(): boolean {
    return this.$store.getters.loadingStatus;
  }

  get roundNumber() {
    return this.$store.getters.roundNumber;
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

  getBoardMoveElementHintClass(move?: GMancalaRegularRegular2DMove): string {
    if (!move) return "";
    if (this.$store.getters.hintVisibility) {
      return "hint-" + move.hint;
    }
    return "";
  }

  getMoveButtonHintClass(moveValue: string): string {
    if (this.$store.getters.hintVisibility) {
      return "c-" + moveValue;
    }
    return "";
  }

  runMove(move: string): void {
    this.$store.dispatch("runMove", move);
  }

  created(): void {
    this.updateRichPositionData();
  }

  mounted(): void {
    this.updateRichPositionData();
  }

  @Watch("loadingStatus")
  async onAsyncRoundChange(): Promise<void> {
    this.updateRichPositionData();
  }

  @Watch("roundNumber")
  onSyncRoundChange(): void {
    this.updateRichPositionData();
  }

  @Watch("hint")
  onHintChange(): void {
    this.updateRichPositionData();
  }
}
</script>

<style lang="scss" scoped>
svg {
  height: 15em;
  width: 45em;
  margin: auto;
  vertical-align: middle;
  > * {
    fill: #d2b48c;
    stroke: var(--neutralColor);
    stroke-width: 0.5;
  }
}

#app-game-board-default-moves-buttons {
  padding: 0.5em 20%;
}

.app-game-board-default-cell {
  stroke: var(--neutralColor);
  stroke-width: 1;
  fill: var(--backgroundColor);

  // Highlight cells placed with a token
  &.placed {
    fill: var(--neutralColor);
  }

  // Highlight move cells on hover
  g:hover > &.move {
    fill: var(--neutralColor);
  }
}

.app-game-board-default-token {
  alignment-baseline: middle;
  text-anchor: middle;
  cursor: default;

  [data-turn="A"] &.move {
    fill: var(--turn0Color);
  }
  [data-turn="B"] &.move {
    fill: var(--turn1Color);
  }

  &.move.hint- {
    &win {
      fill: var(--winColor);
    }
    &draw {
      fill: var(--drawColor);
    }
    &tie {
      fill: var(--tieColor);
    }
    &lose {
      fill: var(--loseColor);
    }
  }
}

</style>
