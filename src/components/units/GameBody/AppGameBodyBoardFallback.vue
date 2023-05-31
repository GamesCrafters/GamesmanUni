<template>
    <svg
      v-if="richPositionData.validRichPosition"  id="app-game-body-board-fallback"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="'-2 -2 ' + (100 + 4) + ' ' + (100 + 4)" :data-turn="richPositionData.turn">
      <g
        v-for="(cell, i) in richPositionData.board"
        :key="'cell' + i"
        @click="!isComputerTurn && cell.move && store.dispatch(actionTypes.runMove, { move: cell.move.str })">
        <rect
          :class="'app-game-board-default-cell ' + (cell.move ? 'move ' : '') + (cell.token != '-' && !cell.move ? 'placed ' : '')"
          :x="xOffset + centers[i][0] * scaledWidth / richPositionData.columns"
          :y="yOffset + centers[i][1] * scaledHeight / richPositionData.rows"
          :width="scaledWidth / richPositionData.columns"
          :height="scaledHeight / richPositionData.rows" />
        <text v-if="cell.token != '-' && cell.token != '*'"
          :x="xOffset + (centers[i][0] + 0.5) * scaledWidth / richPositionData.columns"
          :y="yOffset + (centers[i][1] + 0.5) * scaledHeight / richPositionData.rows"
          :class="'app-game-board-default-token ' + (cell.move ? 'move ' : '') + getBoardMoveElementHintClass(cell.move)"
          :style="{ 
            opacity: options.showNextMoveHints && options.showNextMoveDeltaRemotenesses && cell.move ? cell.move.hintOpacity : 1,
            font: boxSize * 3 / 4 + 'px arial'
          }">
                {{ cell.token }}
        </text>
      </g>
      <g v-for="(arrow, i) in richPositionData.arrows "
        :key="'arrow' + i">
        <polyline
          :points="formatArrowPolylinePoints(arrow, boxSize / 14)"
          :class="'app-game-board-default-arrow ' + getBoardMoveElementHintClass(arrow.move)"
          @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: arrow.move.str })"
          :style="{
            opacity: options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? arrow.move.hintOpacity : 1,
          }"/>
      </g>
    </svg>
    <div id="app-game-body-board-fallback" v-else>
        <div id="position">
            <h3>Current Position</h3>
            <pre>{{ currentPosition }}</pre>
        </div>
        <div id="available-moves" v-if="showNextMoves">
            <h3 id="title">Available Move(s)</h3>
            <div id="moves">
                <template v-if="Object.keys(currentAvailableMoves).length">
                    <div
                      class="move"
                      v-for="availableMove in currentAvailableMoves"
                      :key="availableMove.move"
                      :class="[showNextMoveHints ? `uni-${availableMove.moveValue}` : '', !isComputerTurn ? 'moveIndicator' : '']"
                      :style="{ opacity: showNextMoveDeltaRemotenesses ? availableMove.moveValueOpacity : 1 }"
                      @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: availableMove.move })">{{ availableMove.move }}</div>
                </template>
            </div>
        </div>
        <p id="no-more-move" v-else>No more available Move!</p>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { actionTypes, useStore } from "../../../scripts/plugins/store";

    enum UWAPITurn {
        A = "A",
        B = "B",
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

    const store = useStore();
    const options = computed(() => store.getters.options);
    const showNextMoves = computed(() => (options.value ? options.value.showNextMoves : true));
    const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));
    const showNextMoveDeltaRemotenesses = computed(() => (options.value ? options.value.showNextMoveDeltaRemotenesses : true));
    const currentPosition = computed(() => store.getters.currentPosition.replace(/^;/, "").replace(/;$/, "").replace(/;/g, "\n").replace(/=/g, " = "));
    const currentAvailableMoves = computed(() => store.getters.currentAvailableMoves);
    const isComputerTurn = computed(() => store.getters.currentPlayer.isComputer);

    const richPositionData = computed(() => {
      const position: string = currentPosition.value;
      const matches = position.match(/^R_(A|B)_([0-9]+)_([0-9]+)_([a-zA-Z0-9-\*]+)*/)!;
      const validRichPosition = matches && matches.length >= 5;

      if (validRichPosition) {
        const turn = matches[1] == "A" ? UWAPITurn.A : UWAPITurn.B;
        const numRows = parseInt(matches[2]);
        const numColumns = parseInt(matches[3]);
        const board: GDefaultRegular2DBoardCell[] = matches[4]
            .slice(0, numRows * numColumns)
            .split("")
            .map((token) => ({ token }));
        let arrows: GDefaultRegular2DBoardArrow[] = [];
        for (let nextMoveData of Object.values(currentAvailableMoves.value)) {
            const move = {
                str: nextMoveData.move,
                hint: nextMoveData.moveValue,
                hintOpacity: nextMoveData.moveValueOpacity,
            };
            let matches;
            if ((matches = nextMoveData.move.match(/^A_([a-zA-Z0-9-\*])_([0-9]+)$/))) {
                // Add a piece to the board
                const to = parseInt(matches[2]);
                if (matches[1] == '-') {
                  board[to].token = '●';
                } else {
                  board[to].token = matches[1];
                }
                board[to].move = move;
            } else if ((matches = nextMoveData.move.match(/^M_([0-9]+)_([0-9]+)$/))) {
                // Move a piece
                arrows.push({
                    from: parseInt(matches[1]),
                    to: parseInt(matches[2]),
                    move,
                });
            } else if ((matches = nextMoveData.move.match(/^S_([LR])_([0-9]+)_([0-9]+)$/))) {
                // Shift the board
                const dir = matches[1];
                const row = parseInt(matches[2]);
                const amt = parseInt(matches[3]); // Not visualizing this at the moment
                arrows.push({
                    from: dir == "R" ? numColumns * row : numColumns * (row + 1) - 1,
                    to: dir == "R" ? numColumns * row + 1 : numColumns * (row + 1) - 2,
                    move,
                });
            } else {
                console.error("NOTREACHED");
            }
          }


        const calcRegular2DBoardTopLeftCoords = (i: number): [number, number] => {
            return [i % numColumns, Math.floor(i / numColumns)];
        };
        const computeSquaredLength = (ax: number, ay: number, bx: number, by: number): number => {
            return Math.pow(ax - bx, 2) + Math.pow(ay - by, 2);
        };
        const compareArrowSquaredLength = (a: GDefaultRegular2DBoardArrow, b: GDefaultRegular2DBoardArrow): number => {
            const aFromCoords = calcRegular2DBoardTopLeftCoords(a.from);
            const aToCoords = calcRegular2DBoardTopLeftCoords(a.to);
            const bFromCoords = calcRegular2DBoardTopLeftCoords(b.from);
            const bToCoords = calcRegular2DBoardTopLeftCoords(b.to);
            return computeSquaredLength(bFromCoords[0], bFromCoords[1], bToCoords[0], bToCoords[1]) - computeSquaredLength(aFromCoords[0], aFromCoords[1], aToCoords[0], aToCoords[1]);
        };
        arrows = arrows.sort(compareArrowSquaredLength);
        return {
            turn: turn,
            rows: numRows,
            columns: numColumns,
            board,
            arrows,
            validRichPosition,
        };
      }

      return {
        turn: UWAPITurn.A,
        rows: 1,
        columns: 1,
        validRichPosition
      }
    });

    const prop = richPositionData.value.rows * 100 / richPositionData.value.columns;
    const scaledWidth = (prop >= 100 ? (100 * 100 / prop) : 100);
    const scaledHeight = (prop >= 100 ? 100 : prop);
    const xOffset = (100 - scaledWidth) / 2;
    const yOffset = (100 - scaledHeight) / 2;
    const boxSize = (richPositionData.value.rows > richPositionData.value.columns ? 100 / richPositionData.value.rows : 100 / richPositionData.value.columns);

    const calcRegular2DBoardTopLeftCoords = (i: number): [number, number] => {
        return [i % richPositionData.value.columns, Math.floor(i / richPositionData.value.columns)];
    };

    const centers = computed(() => 
      [...Array(richPositionData.value.rows * richPositionData.value.columns).keys()].map(
        (i: number) => 
        [i % richPositionData.value.columns, Math.floor(i / richPositionData.value.columns)]
      )
    );

  const formatArrowPolylinePoints = (arrow: GDefaultRegular2DBoardArrow, thickness: number = 0.75, startOffset: number = 3, endOffset: number = 3): string => {
    let fromCoords = calcRegular2DBoardTopLeftCoords(arrow.from).map((a: number) => ((a) + 0.5) * scaledWidth / richPositionData.value.columns);
    let coords3 = calcRegular2DBoardTopLeftCoords(arrow.to).map((a: number) => ((a) + 0.5) * scaledHeight / richPositionData.value.rows);
    fromCoords[0] += xOffset;
    fromCoords[1] += yOffset;
    coords3[0] += xOffset;
    coords3[0] += yOffset;
    const dir = [coords3[0] - fromCoords[0], coords3[1] - fromCoords[1]];
    const perpdir = [dir[1], -dir[0]];
    const length = Math.sqrt(Math.pow(dir[0], 2) + Math.pow(dir[1], 2));
    let thickNorm = thickness / length;
    const startOffsetPct = startOffset / length;
    const endOffsetPct = endOffset / length;
    fromCoords[0] += dir[0] * startOffsetPct;
    fromCoords[1] += dir[1] * startOffsetPct;
    coords3[0] -= dir[0] * endOffsetPct;
    coords3[1] -= dir[1] * endOffsetPct;
    const arrowheadHeight = 3 * thickNorm * Math.tan(0.959931); // 55 degrees
    const midCoords = [coords3[0] - dir[0] * arrowheadHeight, coords3[1] - dir[1] * arrowheadHeight];
    const coords0 = [fromCoords[0] - perpdir[0] * thickNorm, fromCoords[1] - perpdir[1] * thickNorm];
    const coords6 = [fromCoords[0] + perpdir[0] * thickNorm, fromCoords[1] + perpdir[1] * thickNorm];

    const coords1 = [midCoords[0] - perpdir[0] * thickNorm, midCoords[1] - perpdir[1] * thickNorm];
    const coords2 = [midCoords[0] - 3 * perpdir[0] * thickNorm, midCoords[1] - 3 * perpdir[1] * thickNorm];
    const coords5 = [midCoords[0] + perpdir[0] * thickNorm, midCoords[1] + perpdir[1] * thickNorm];
    const coords4 = [midCoords[0] + 3 * perpdir[0] * thickNorm, midCoords[1] + 3 * perpdir[1] * thickNorm];

    return `${coords0[0]},${coords0[1]} ${coords1[0]},${coords1[1]} ${coords2[0]},${coords2[1]} ${coords3[0]},${coords3[1]} ${coords4[0]},${coords4[1]} ${coords5[0]},${coords5[1]} ${coords6[0]},${coords6[1]}`;
  };

  const getBoardMoveElementHintClass = (move?: GDefaultRegular2DMove): string => (move && options.value.showNextMoveHints ? "hint-" + move.hint : "");

  const getMoveButtonHintClass = (moveValue: string): string => (options.value.showNextMoveHints ? "c-" + moveValue : "");
</script>

<style lang="scss" scoped>
    #app-game-body-board-fallback {
        > * {
            border: 0.1rem solid var(--neutralColor);
            border-radius: 1rem;
        }
        > #position {
            border: 0.1rem solid var(--neutralColor);
            border-radius: 1rem;
            > pre {
                display: inline-block;
                padding: 1rem;
            }
        }
        > #available-moves {
            padding: 1rem;
            > #title {
                margin: 1rem;
            }
            > #moves {
                align-content: center;
                align-items: center;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
                > .move {
                    border: 0.1rem solid var(--neutralColor);
                    border-radius: 1rem;
                    margin: 1rem;
                    padding: 1rem;
                    &.moveIndicator:hover {
                        cursor: pointer;
                    }
                }
            }
        }
        > #no-more-move {
            text-align: center;
        }
        width: 100%;
        height: 100%;
    }

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
        fill: var(--turn1Color);
      }
      [data-turn="B"] &.move {
        fill: var(--turn2Color);
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

    @keyframes pulsing-arrow {
      0% {
        stroke-width: 1;
      }
      100% {
        stroke-width: 1.5;
      }
    }

    .app-game-board-default-arrow {
    stroke: var(--primaryColor);
    fill: var(--primaryColor);

    [data-turn="A"] & {
      stroke: var(--turn1Color);
      fill: var(--turn1Color);
    }
    [data-turn="B"] & {
      stroke: var(--turn2Color);
      fill: var(--turn2Color);
    }

    &.hint- {
      &win {
        stroke: var(--winColor);
        fill: var(--winColor);
      }
      &draw {
        stroke: var(--drawColor);
        fill: var(--drawColor);
      }
      &tie {
        stroke: var(--tieColor);
        fill: var(--tieColor);
      }
      &lose {
        stroke: var(--loseColor);
        fill: var(--loseColor);
      }
    }

    &:hover {
      animation-name: pulsing-arrow;
      animation-duration: 0.3s;
      animation-iteration-count: infinite;
      animation-timing-function: ease-in-out;
      animation-direction: alternate;
    }
  }
    svg {
      height: 15em;
      width: 15em;
      margin: auto;
      vertical-align: middle;
    }
</style>
