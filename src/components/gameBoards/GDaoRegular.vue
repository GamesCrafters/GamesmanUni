<template>
  <div id="app-game-board-dao-regular">
    <template>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="'-2 -2 ' + (rows * 10 + 4) + ' ' + (columns * 10 + 4)"
      >
        <defs>
          <!-- Arrow markers with different move values -->
          <template
            v-for="(value, i) in ['default', 'win', 'draw', 'tie', 'lose']"
          >
            <marker
              :id="'marker-' + value"
              :key="i"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 7 5 L 0 9 z" />
            </marker>
          </template>
        </defs>

        <rect
          id="grid-bg"
          :x="0"
          :y="0"
          :width="columns * 10"
          :height="rows * 10"
        />
        <g id="grid">
          <template v-for="index in rows + 1">
            <line
              :x1="0"
              :y1="(index - 1) * 10"
              :x2="columns * 10"
              :y2="(index - 1) * 10"
              :key="'horizontal' + (index - 1)"
            />
          </template>
          <template v-for="index in columns + 1">
            <line
              :x1="(index - 1) * 10"
              :y1="0"
              :x2="(index - 1) * 10"
              :y2="rows * 10"
              :key="'vertical' + (index - 1)"
            />
          </template>
        </g>

        <g id="arrows" v-if="showMoves">
          <line
            v-for="move of moves"
            stroke-width="1"
            @click="runMove(move.moveStr)"
            :class="'arrow ' + move.moveClass"
            :opacity="move.moveOpacity"
            :x1="move.startX * 10 + 5"
            :y1="move.startY * 10 + 5"
            :x2="move.endX * 10 + 5"
            :y2="move.endY * 10 + 5"
            :key="move.moveStr"
            :marker-end="move.markerID"
          />
        </g>

        <g id="pieces">
          <circle
            r="4"
            v-for="piece of pieces"
            @transitionstart="showMoves = false"
            @transitionend="showMoves = true"
            :class="'player-' + piece.player + '-pieces'"
            :key="piece.id"
            :cx="piece.x * 10 + 5"
            :cy="piece.y * 10 + 5"
          />
        </g>
      </svg>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { TMoveData } from "@/types/internal/TMoveData";
import { CRound } from "@/classes/CRound";

interface Piece {
  id: string;
  player: number;
  x: number;
  y: number;
}

interface Move {
  moveStr: string;
  moveClass: string;
  moveOpacity: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  markerID: string;
}

@Component
export default class GDaoRegular extends Vue {
  rows = 4;
  columns = 4;

  data() {
    return {
      pieces: [],
      moves: [],
      prevPositionStr: "",
      showMoves: true,
    };
  }

  updatePieces(): void {
    let boardStr: string = this.positionStr;
    if (boardStr != null) {
      if (this.roundNumber == 1) {
        this.$data.pieces = this.createPieces(boardStr, this.rows);
      } else {
        this.$data.pieces = this.movePieces(
          this.$data.prevPositionStr,
          boardStr
        );
      }
      this.$data.prevPositionStr = boardStr;
    }
  }

  updateMoves(): void {
    this.$data.moves = [];
    for (let nextMoveData of this.nextMoveDataArray) {
      let nextMoveClass = this.getMoveButtonHintClass(nextMoveData.moveValue);

      let nextMoveOpacity = 1;
      if (
        this.$store.getters.deltaRemotenessVisibility &&
        this.$store.getters.hintVisibility
      ) {
        nextMoveOpacity = nextMoveData.moveValueOpacity;
      }

      let markerID = this.getMarkerID(nextMoveData.moveValue);
      let moveStr = nextMoveData.move;
      let moveArr = moveStr.split("_");

      let startX = Math.floor(parseInt(moveArr[1]) / 4);
      let startY = parseInt(moveArr[1]) % 4;

      let endX = Math.floor(parseInt(moveArr[2]) / 4);
      let endY = parseInt(moveArr[2]) % 4;

      if (endX > startX) {
        endX = startX + 0.8;
      } else if (endX < startX) {
        endX = startX - 0.8;
      }

      if (endY > startY) {
        endY = startY + 0.8;
      } else if (endY < startY) {
        endY = startY - 0.8;
      }

      let newMove: Move;
      newMove = {
        moveStr: moveStr,
        moveClass: nextMoveClass,
        moveOpacity: nextMoveOpacity,
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY,
        markerID: markerID,
      };

      this.$data.moves.push(newMove);
    }
  }

  createPieces(boardStr: string, rows: number): Piece[] {
    let pieceList: Piece[] = [];
    let player1Counter = 0;
    let player2Counter = 0;
    for (let i = 0; i < boardStr.length; i++) {
      let newPiece: Piece;
      if (boardStr.charAt(i) == "x") {
        newPiece = {
          id: "player1-" + player1Counter,
          player: 1,
          x: Math.floor(i / rows),
          y: i % rows,
        };
        pieceList.push(newPiece);
        player1Counter++;
      } else if (boardStr.charAt(i) == "o") {
        newPiece = {
          id: "player2-" + player2Counter,
          player: 2,
          x: Math.floor(i / rows),
          y: i % rows,
        };
        pieceList.push(newPiece);
        player2Counter++;
      }
    }
    return pieceList;
  }

  movePieces(prevBoardStr: string, currBoardStr: string): Piece[] {
    let diffCounter = 0;
    let prevX = 0;
    let prevY = 0;
    let nextX = 0;
    let nextY = 0;
    for (let i = 0; i < prevBoardStr.length; i++) {
      if (prevBoardStr.charAt(i) != currBoardStr.charAt(i)) {
        diffCounter += 1;
        if (prevBoardStr.charAt(i) != "-") {
          prevX = Math.floor(i / this.rows);
          prevY = i % 4;
        } else {
          nextX = Math.floor(i / this.rows);
          nextY = i % 4;
        }
      }
    }
    if (diffCounter > 2) {
      return this.createPieces(currBoardStr, this.rows);
    }
    for (let i = 0; i < this.$data.pieces.length; i++) {
      let piece = this.$data.pieces[i];
      if (piece.x == prevX && piece.y == prevY) {
        piece.x = nextX;
        piece.y = nextY;
      }
    }
    return this.$data.pieces;
  }

  get positionStr(): string {
    return this.$store.getters.position.split("_")[4];
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

  getMoveButtonHintClass(moveValue: string): string {
    if (this.$store.getters.hintVisibility) {
      return "c-" + moveValue;
    }
    return "c-default";
  }

  getMarkerID(moveValue: string): string {
    if (this.$store.getters.hintVisibility) {
      return `url(#marker-${moveValue})`;
    }
    return "url(#marker-default)";
  }

  runMove(move: string): void {
    this.$store.dispatch("runMove", move);
  }

  created(): void {
    this.updatePieces();
    this.updateMoves();
  }

  mounted(): void {
    this.updatePieces();
    this.updateMoves();
  }

  @Watch("loadingStatus")
  async onAsyncRoundChange(): Promise<void> {
    if (!this.loadingStatus) {
      this.updatePieces();
      this.updateMoves();
    }
  }

  @Watch("roundNumber")
  onSyncRoundChange(): void {
    this.$data.showMoves = false; //Next moves update sooner than pieces on undo, this prevents the arrows from popping up
    this.updatePieces();
    this.updateMoves();
  }

  @Watch("hintVisibility")
  onHintChange(): void {
    this.updateMoves();
  }
}
</script>

<style lang="scss" scoped>
#grid {
  stroke: black;
  stroke-linecap: square;
  stroke-width: 0.5;
}

#grid-bg {
  fill: #d3d3d3;
}

.player-1-pieces {
  stroke: black;
  fill: black;
  stroke-width: 0.5;
  transition-property: cx, cy;
  transition-duration: 1s;
}

.player-2-pieces {
  stroke: white;
  fill: white;
  stroke-width: 0.5;
  transition-property: cx, cy;
  transition-duration: 1s;
}

.c-win {
  stroke: var(--winColor);
}

.c-lose {
  stroke: var(--loseColor);
}

.c-tie {
  stroke: var(--tieColor);
}

.c-draw {
  stroke: var(--drawColor);
}

.c-default {
  stroke: black;
}

#marker-win {
  fill: var(--winColor);
}

#marker-lose {
  fill: var(--loseColor);
}

#marker-tie {
  fill: var(--tieColor);
}

#marker-draw {
  fill: var(--drawColor);
}

#marker-default {
  fill: black;
}

.arrow {
  &:hover {
    animation-name: pulsing-arrow;
    animation-duration: 0.3s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    animation-direction: alternate;
  }
}

@keyframes pulsing-arrow {
  0% {
    stroke-width: 1;
  }
  100% {
    stroke-width: 1.5;
  }
}
</style>
