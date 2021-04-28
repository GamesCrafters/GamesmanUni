<!-- <template>
  <div id="app-game-board-ten-regular">
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <g v-for="i in cellCount" :key="i">
        <rect
          class="cell"
          x="55"
          :y="10 * (i - 1) + 2.5"
          width="10"
          height="10"
        />
        <circle
          class="hint"
          :class="boardData[cellCount - i].hint"
          cx="60"
          :cy="10 * (i - 1) + 7.5"
          r="4.5"
        />
        <rect
          class="token"
          :class="boardData[cellCount - i].token"
          x="55"
          :y="10 * (i - 1) + 12.5"
          width="10"
          height="10"
        />
        <text class="position" x="56" :y="10 * i">
          {{ boardData[cellCount - i].board }}
        </text>
        <rect
          class="move"
          @click="
            boardData[cellCount - i].clickable
              ? runMove(boardData[cellCount - i].move)
              : null
          "
          x="55"
          :y="10 * (i - 1) + 2.5"
          width="10"
          height="10"
        />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { CGame } from "@/classes/CGame";
import { CRound } from "@/classes/CRound";

@Component
export default class GTenRegular extends Vue {
  cellCount: number = 11;
  boardData: {
    [cell: string]: {
      token: string;
      hint: string;
      clickable: boolean;
      move: string;
      board: string;
    };
  } = this.initBoardData();

  get loadingStatus(): boolean {
    return this.$store.getters.loadingStatus;
  }

  get game(): CGame {
    return this.$store.getters.game;
  }

  initBoardData(): {
    [cell: string]: {
      token: string;
      hint: string;
      clickable: boolean;
      move: string;
      board: string;
    };
  } {
    let boardData: {
      [cell: string]: {
        token: string;
        hint: string;
        clickable: boolean;
        move: string;
        board: string;
      };
    } = {};
    for (let cell: number = 0; cell < this.cellCount; cell++) {
      boardData[cell.toString()] = {
        token: "",
        hint: "",
        clickable: false,
        move: "",
        board: cell.toString()
      };
    }
    return boardData;
  }

  created(): void {
    this.boardData = this.initBoardData();
  }

  mounted(): void {
    this.updateBoardData();
  }

  @Watch("$store.getters.loadingStatus")
  updateBoardData(): void {
    if (!this.loadingStatus) {
      this.boardData = this.initBoardData();
      const rounds: Array<CRound> = this.$store.getters.roundArray;
      const round: CRound = this.$store.getters.round;
      for (
        let roundIndex: number = 0;
        roundIndex < round.getRoundNumber() - 1;
        roundIndex++
      ) {
        if (rounds[roundIndex].getMove() != "") {
          this.boardData[
            rounds[roundIndex].getPosition().substring(2)
          ].token = `turn-${rounds[roundIndex].getTurnId()}-token`;
        }
      }
      for (let nextMoveData of round.getNextMoveDataArray()) {
        Object.assign(this.boardData[nextMoveData.position.substring(2)], {
          move: nextMoveData.move,
          hint: `hint-${nextMoveData.moveValue}`,
          clickable: true
        });
      }
    }
  }

  runMove(move: string): void {
    this.$store.dispatch("runMove", move);
  }
}
</script>

<style lang="scss" scoped>
.cell {
  fill: rgba(0, 0, 0, 0);
  stroke: var(--primaryColor);
  stroke-width: 0.5;
}

.position {
  fill: var(--primaryColor);
  font-size: 6px;
}

.token {
  fill: rgba(0, 0, 0, 0);
}

.turn-0-token {
  fill: var(--turn0Color);
  fill-opacity: 0.5;
}

.turn-1-token {
  fill: var(--turn1Color);
  fill-opacity: 0.5;
}

.hint {
  fill: rgba(0, 0, 0, 0);
}

.hint-win {
  fill: var(--winColor);
  fill-opacity: 0.8;
}

.hint-draw {
  fill: var(--drawColor);
  fill-opacity: 0.8;
}

.hint-tie {
  fill: var(--tieColor);
  fill-opacity: 0.8;
}

.hint-lose {
  fill: var(--loseColor);
  fill-opacity: 0.8;
}

.move {
  fill: rgba(0, 0, 0, 0);
}
</style> -->
