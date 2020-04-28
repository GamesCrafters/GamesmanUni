<template>
  <div id="app-game-board-mancala-regular">
    <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">

      <g id="board">

        <g
          v-for="store in getAllStores"
          :key="store.id">
          <path id="store"
          :d="store.d"
          />
          <circle id="pieces"
            v-for="(position, index) in piecesInBins[+store.index]"
            :key="index"
            r="1" :cx="position[0]" :cy="position[1]"
          />
        </g>

        <g id="pocket"
          v-for="pocket in getAllPockets"
          :key="pocket.id"
          @click="pocket.nextMove == '' ? 1 : runMove(pocket.nextMove)">
          <circle
            r="4"
            :cx="pocket.x"
            :cy="pocket.y"
            :class="pocket.class"
            :opacity="pocket.opacity"
          />
          <circle id="pieces"
            v-for="(position, index) in piecesInBins[+pocket.index]"
            :key="index"
            r="1" :cx="position[0]" :cy="position[1]"
          />
        </g>
      </g>


      <text id="count"
        v-for="store in getAllStores"
        :key="store.id"
        :x="store.countX"
        :y="store.countY"
      >{{ currPosition[store.index] }}</text>

      <text id="count"
        v-for="pocket in getAllPockets"
        :key="pocket.id"
        :x="pocket.countX"
        :y="pocket.countY"
      >{{ currPosition[pocket.index] }}</text>
    </svg>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { TMoveData } from "@/types/internal/TMoveData";
import { CRound } from "@/classes/CRound";

@Component
export default class GMancalaRegular extends Vue {
  position = this.generatePosition();
  allPockets: {
    [id: string]: {
      index: number;
      x: number;
      y: number;
      countX: number;
      countY: number;
      class: string;
      opacity: number;
      nextMove: string;
    };
  } = this.pocket();

  allStores: {
    [id: string]: {
      x: number;
      y: number;
      index: number;
      d: string;
      countX: number;
      countY: number;
    };
  } = this.store();

  pieces = this.generatePiecesInBins(this.position);

  pocket() {
    let po: {
      [id: string]: {
        index: number;
        x: number;
        y: number;
        countX: number;
        countY: number;
        class: string;
        opacity: number;
        nextMove: string;
      };
    } = {};

    po["po1"] = {
      index: 1,
      x: 20,
      y: 7.5,
      countX: 20,
      countY: 3,
      class: "default-pocket",
      opacity: 1,
      nextMove: ""
    };

    po["po2"] = {
      index: 2,
      x: 30,
      y: 7.5,
      countX: 30,
      countY: 3,
      class: "default-pocket",
      opacity: 1,
      nextMove: ""
    };

    po["po3"] = {
      index: 3,
      x: 40,
      y: 7.5,
      countX: 40,
      countY: 3,
      class: "default-pocket",
      opacity: 1,
      nextMove: ""
    };

    po["po7"] = {
      index: 5,
      x: 40,
      y: 22.5,
      countX: 40,
      countY: 29,
      class: "default-pocket",
      opacity: 1,
      nextMove: ""
    };

    po["po6"] = {
      index: 6,
      x: 30,
      y: 22.5,
      countX: 30,
      countY: 29,
      class: "default-pocket",
      opacity: 1,
      nextMove: ""
    };

    po["po5"] = {
      index: 7,
      x: 20,
      y: 22.5,
      countX: 20,
      countY: 29,
      class: "default-pocket",
      opacity: 1,
      nextMove: ""
    };

    return po;
  }

  store() {
    let sto: {
      [id: string]: {
        x: number;
        y: number;
        index: number;
        d: string;
        countX: number;
        countY: number;
      };
    } = {};

    sto["sto0"] = {
      x: 10,
      y: 15,
      index: 0,
      d: "M 6 7.5 L 6 22.5 A 4 4 180 0 0 14 22.5 L 14 7.5 A 4 4 0 0 0 6 7.5",
      countX: 4,
      countY: 15
    };

    sto["sto4"] = {
      x: 50,
      y: 15,
      index: 4,
      d: "M 46 7.5 L 46 22.5 A 4 4 180 0 0 54 22.5 L 54 7.5 A 4 4 0 0 0 46 7.5",
      countX: 56,
      countY: 15
    };

    return sto;
  }

  generatePosition(): string[] {
    let position: string = this.$store.getters.position;
    return position.split(";")[0].split("s");
  }

  generatePiecePositions(binX: number, binY: number, numPieces: number): number[][] {
    let positions: number[][] = [];
    function generateBinOffsets(binX: number, binY: number): number[] {
      let offsets = [binX-1, binY, binX+1, binY, binX-3, binY, binX+3, binY,
        binX, binY-2, binX-2, binY-2, binX+2, binY-2, binX, binY+2, binX-2,
        binY+2, binX+2, binY+2, binX-2, binY-1, binX, binY-1, binX+2, binY-1,
        binX-2, binY+1, binX, binY+1, binX+2, binY+1, binX-1, binY-3, binX+1,
        binY-3, binX-1, binY+3, binX+1, binY+3, binX-1, binY-2, binX+1,
        binY-2, binX-1, binY, binX+1, binY];
      return offsets;
    }

    let offsets = generateBinOffsets(binX, binY);
    for (let i = 0; i < numPieces; i++) {
      let curr: number[] = [offsets[i*2], offsets[i*2+1]];
      positions.push(curr);
    }
    return positions;
  }

  generatePiecesInBins(position: string[]): number[][][] {
    let bins: number[][][] = [];
    let pieces: string[] = position;

    for (let pocket in this.allPockets) {
      let x = this.allPockets[pocket].x;
      let y = this.allPockets[pocket].y;
      let index = +(this.allPockets[pocket].index);
      bins.push(this.generatePiecePositions(x, y, +pieces[index]));
    }

    for (let store in this.allStores) {
      let x = this.allStores[store].x;
      let y = this.allStores[store].y;
      let index = +(this.allStores[store].index);
      bins.splice(index, 0, this.generatePiecePositions(x, y, +pieces[index]));
    }

    return bins;
  }

  updatePosition(): void {
    this.position = this.generatePosition();
    this.pieces = this.generatePiecesInBins(this.position);
    this.updateNextMove();
  }

  updateNextMove(): void {
    this.resetStyles();
    for (let nextMoveData of this.nextMoveDataArray) {
      let idStr = "po" + nextMoveData.move;
      let nextMoveClass = this.getMoveButtonHintClass(nextMoveData.moveValue);
      if (nextMoveClass == "") {
        nextMoveClass = "default-pocket";
      }

      let nextMoveOpacity = 1;
      if (this.$store.getters.deltaRemotenessVisibility && this.$store.getters.hintVisibility) {
        nextMoveOpacity = nextMoveData.moveValueOpacity;
      }

      this.allPockets[idStr].class = nextMoveClass;
      this.allPockets[idStr].opacity = nextMoveOpacity;
      this.allPockets[idStr].nextMove = nextMoveData.move;
    }
  }

  resetStyles(): void {
    for (let po in this.allPockets) {
      this.allPockets[po].class = "default-pocket";
      this.allPockets[po].opacity = 1;
      this.allPockets[po].nextMove = "";
    }
  }

  get getAllPockets() {
    let copy = JSON.parse(JSON.stringify(this.allPockets));
    return copy;
  }

  get getAllStores() {
    let copy = JSON.parse(JSON.stringify(this.allStores));
    return copy;
  }

  get piecesInBins() {
    return this.pieces;
  }

  get currPosition() {
    return this.position;
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
    return "";
  }

  runMove(move: string): void {
    this.$store.dispatch("runMove", move);
  }

  created(): void {
    this.updatePosition();
  }

  mounted(): void {
    this.updatePosition();
  }

  @Watch("loadingStatus")
  async onAsyncRoundChange(): Promise<void> {
    this.updatePosition();
  }

  @Watch("roundNumber")
  onSyncRoundChange(): void {
    this.updatePosition();
  }

  @Watch("hintVisibility")
  onHintChange(): void {
    console.log("reached");
    this.updatePosition();
  }
}
</script>

<style lang="scss" scoped>
svg {
  height: 15em;
  width: 30em;
  margin: auto;
  vertical-align: middle;
  #board {
    stroke: var(--neutralColor);
    stroke-width: 0.5;
  }

  #store {
    fill: #d2b48c;
  }

  #pieces {
    fill: #ADD8E6;
    stroke: #00008b;
    stroke-width: 0.25;
  }

  #count {
    font-size: 2.5px;
    text-anchor: middle;
  }

  #pocket:hover {
    opacity: 50%;
  }

}

#app-game-board-default-moves-buttons {
  padding: 0.5em 20%;
}

.default-pocket {
  fill: #d2b48c;
}

.c-win {
  fill: var(--winColor);
}

.c-lose {
  fill: var(--loseColor);
}

.c-tie {
  fill: var(--tieColor);
}

.c-draw {
  fill: var(--drawColor);
}

.app-game-board-default-cell {
  stroke: var(--neutralColor);
  stroke-width: 1;
  fill: var(--backgroundColor);
}

</style>
