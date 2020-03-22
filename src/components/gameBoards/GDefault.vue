<template>
  <div id="app-game-board-default">
    <div id="app-game-board-default-position">
      <h3 id="app-game-board-default-position-title">Position</h3>
      <template v-if="richPositionData.type == GDefaultPositionTypes.String">
        <pre id="app-game-board-default-position-value">{{
          richPositionData.str
        }}</pre>
      </template>
      <template
        v-if="richPositionData.type == GDefaultPositionTypes.UWAPIRegular2D"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          :viewBox="
            '-2 -2 ' +
              (richPositionData.rows * 20 + 4) +
              ' ' +
              (richPositionData.columns * 20 + 4)
          "
          :data-turn="richPositionData.turn"
        >
          <defs>
            <marker
              id="app-game-board-default-arrow-marker-turn"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto-start-reverse"
            >
              <circle cx="5" cy="5" r="3" />
            </marker>
            <!-- Arrow markers with different move values -->
            <template v-for="(value, i) in ['', 'win', 'draw', 'tie', 'lose']">
              <marker
                :id="
                  'app-game-board-default-arrow-marker' +
                    (value ? '-' + value : '')
                "
                :key="i"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
            </template>
          </defs>
          <!-- Board cells & existing/new pieces -->
          <g
            v-for="(cell, i) in richPositionData.board"
            :key="'cell' + i"
            :set="(coords = calcRegular2DBoardTopLeftCoords(i))"
            @click="cell.move && runMove(cell.move.str)"
          >
            <rect
              :class="
                'app-game-board-default-cell ' +
                  (cell.move ? 'move ' : '') +
                  (cell.token != '-' && !cell.move ? 'placed ' : '')
              "
              :x="coords[0] * 20"
              :y="coords[1] * 20"
              width="20"
              height="20"
            />
            <text
              v-if="cell.token != '-'"
              :x="coords[0] * 20 + 10"
              :y="coords[1] * 20 + 10"
              :class="
                'app-game-board-default-token ' +
                  (cell.move ? 'move ' : '') +
                  getBoardMoveElementHintClass(cell.move)
              "
              :style="{
                opacity:
                  hintVisibility && deltaRemotenessVisibility && cell.move
                    ? cell.move.hintOpacity
                    : 1
              }"
            >
              {{ cell.token }}
            </text>
          </g>
          <!-- Move arrows -->
          <g v-for="(arrow, i) in richPositionData.arrows" :key="'arrow' + i">
            <polyline
              :points="formatArrowPolylinePoints(arrow, 20)"
              :class="
                'app-game-board-default-arrow ' +
                  getBoardMoveElementHintClass(arrow.move)
              "
              @click="runMove(arrow.move.str)"
              :style="{
                opacity:
                  hintVisibility && deltaRemotenessVisibility
                    ? arrow.move.hintOpacity
                    : 1
              }"
              marker-start="url(#app-game-board-default-arrow-marker-turn)"
              :marker-end="getHintArrowMarker(arrow.move)"
            />
          </g>
        </svg>
      </template>
    </div>
    <hr v-if="nextMovesVisibility" class="c-divider" />
    <div v-if="nextMovesVisibility" id="app-game-board-default-moves">
      <h3 id="app-game-board-default-moves-title">Move(s)</h3>
      <div id="app-game-board-default-moves-buttons" v-if="nextMoveDataArray">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { TMoveData } from "@/types/internal/TMoveData";
import { CRound } from "@/classes/CRound";

enum GDefaultPositionTypes {
  String,
  UWAPIRegular2D
}

enum UWAPITurn {
  A = "A",
  B = "B"
}

interface GDefaultRegular2DMove {
  str: string; // UWAPI move string
  hint: string;
  hintOpacity: number;
}

interface GDefaultRegular2DBoardCell {
  token: string;
  move?: GDefaultRegular2DMove;
}

interface GDefaultRegular2DBoardArrow {
  from: number;
  to: number;
  move: GDefaultRegular2DMove;
}

type GDefaultPosition =
  | {
      type: GDefaultPositionTypes.String;
      str: string;
    }
  | {
      type: GDefaultPositionTypes.UWAPIRegular2D;
      turn: UWAPITurn;
      rows: number;
      columns: number;
      board: GDefaultRegular2DBoardCell[];
      arrows: GDefaultRegular2DBoardArrow[];
    };

@Component
export default class GDefault extends Vue {
  GDefaultPositionTypes = GDefaultPositionTypes;
  richPositionData = this.generateRichPositionData();

  generateRichPositionData(): GDefaultPosition {
    let position: string = this.$store.getters.position;

    function makeDefaultStringPosition(): GDefaultPosition {
      let str = position;
      str = str.replace(/^;/, "");
      str = str.replace(/;$/, "");
      str = str.replace(/;/g, "\n");
      str = str.replace(/=/g, " = ");
      return {
        type: GDefaultPositionTypes.String,
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
      let board: GDefaultRegular2DBoardCell[] = matches[4]
        .split("")
        .map(token => ({
          token
        }));
      let arrows: GDefaultRegular2DBoardArrow[] = [];
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
            // Move a piece
            arrows.push({
              from: parseInt(matches[1]),
              to: parseInt(matches[2]),
              move
            });
          } else {
            console.error("NOTREACHED");
            // Fallback to string type position
            return makeDefaultStringPosition();
          }
        });
      return {
        type: GDefaultPositionTypes.UWAPIRegular2D,
        turn: matches[1] == "A" ? UWAPITurn.A : UWAPITurn.B,
        rows: parseInt(matches[2]),
        columns: parseInt(matches[3]),
        board,
        arrows
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

  calcRegular2DBoardTopLeftCoords(i: number): [number, number] {
    let richPositionData = this.richPositionData;
    if (richPositionData.type != GDefaultPositionTypes.UWAPIRegular2D)
      return [0, 0];
    return [i % richPositionData.rows, Math.floor(i / richPositionData.rows)];
  }

  formatArrowPolylinePoints(
    arrow: GDefaultRegular2DBoardArrow,
    multiplier: number,
    endOffset: number = 7
  ): string {
    let fromCoords = this.calcRegular2DBoardTopLeftCoords(arrow.from).map(
      a => (a + 0.5) * multiplier
    );
    let toCoords = this.calcRegular2DBoardTopLeftCoords(arrow.to).map(
      a => (a + 0.5) * multiplier
    );
    const dir = [toCoords[0] - fromCoords[0], toCoords[1] - fromCoords[1]];
    const length = Math.sqrt(Math.pow(dir[0], 2) + Math.pow(dir[1], 2));
    const endOffsetPct = endOffset / length;
    fromCoords[0] += dir[0] * endOffsetPct;
    fromCoords[1] += dir[1] * endOffsetPct;
    toCoords[0] -= dir[0] * endOffsetPct;
    toCoords[1] -= dir[1] * endOffsetPct;
    return (
      `${fromCoords[0]},${fromCoords[1]} ` + `${toCoords[0]},${toCoords[1]}`
    );
  }

  getBoardMoveElementHintClass(move?: GDefaultRegular2DMove): string {
    if (!move) return "";
    if (this.$store.getters.hintVisibility) {
      return "hint-" + move.hint;
    }
    return "";
  }

  getHintArrowMarker(move?: GDefaultRegular2DMove): string {
    if (!move) return "";
    if (this.$store.getters.hintVisibility) {
      return `url(#app-game-board-default-arrow-marker-${move.hint})`;
    }
    return "url(#app-game-board-default-arrow-marker)";
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
    !this.loadingStatus && this.updateRichPositionData();
  }

  @Watch("roundNumber")
  onSyncRoundChange(): void {
    !this.loadingStatus && this.updateRichPositionData();
  }

  @Watch("hint")
  onHintChange(): void {
    this.updateRichPositionData();
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

#app-game-board-default-arrow-marker-turn {
  [data-turn="A"] & {
    fill: var(--turn0Color);
  }
  [data-turn="B"] & {
    fill: var(--turn1Color);
  }
}

#app-game-board-default-arrow-marker {
  fill: var(--primaryColor);

  [data-turn="A"] & {
    fill: var(--turn0Color);
  }
  [data-turn="B"] & {
    fill: var(--turn1Color);
  }

  &-win {
    fill: var(--winColor);
  }
  &-draw {
    fill: var(--drawColor);
  }
  &-tie {
    fill: var(--tieColor);
  }
  &-lose {
    fill: var(--loseColor);
  }
}

.app-game-board-default-arrow {
  stroke: var(--primaryColor);

  [data-turn="A"] & {
    stroke: var(--turn0Color);
  }
  [data-turn="B"] & {
    stroke: var(--turn1Color);
  }

  &.hint- {
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
}
</style>
