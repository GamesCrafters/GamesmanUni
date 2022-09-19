<template>
  <!--Render board only if the boardstring is valid i.e. is a "validRichPosition". -->
  <svg
    v-if="richPositionData.validRichPosition" 
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="'-2 -2 104 ' + (theHeight + 4)" 
    :data-turn="richPositionData.turn">

    <defs>
      <template v-for="(value, i) in ['', 'win', 'draw', 'tie', 'lose']" :key="i">
        <marker
          :id="'app-game-board-default-arrow-marker' + (value ? '-' + value : '')"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" />
        </marker>
      </template>
    </defs>

    <!-- Draw Background Image -->
    <svg 
      :width="100" 
      :height="(theHeight)">
      <image 
        :width="100"
        :height="(theHeight)"
        :href=pathPrefix+backgroundImagePath />
    </svg>

    <!-- Draw Pieces on Board. -->
    <g v-for="(cell, i) in richPositionData.board"
      :key="'cell' + i"
      :set="(coords = calcRegular2DBoardTopLeftCoords(i))">
      <image
            v-if="cell.piece != '-' && cell.piece != '*' && Object.keys(pieces).includes(cell.piece)"
            :x="(coords[0] - 0.5 * pieces[cell.piece].scale) * 100 / backgroundGeometry[0]"
            :y="(coords[1] - 0.5 * pieces[cell.piece].scale) * 100 / backgroundGeometry[0]"
            :width="(pieces[cell.piece].scale) * 100 / backgroundGeometry[0]"
            :height="(pieces[cell.piece].scale) * 100 / backgroundGeometry[0]"
            :href=pathPrefix+pieces[cell.piece].image />
    </g>

    <!-- Draw A-type Moves. -->
    <g v-for="(cell, i) in richPositionData.board" 
      :key="'cell' + i"
      :set="(coords = calcRegular2DBoardTopLeftCoords(i))">
      <g v-if="cell.move">

        <!-- If no move token specified, use default move token (a circle). -->
        <circle
          v-if="cell.token == '-'"
            :cx="coords[0] * 100 / backgroundGeometry[0]"
            :cy="coords[1] * 100 / backgroundGeometry[0]"
            :r="2"
            :class="'app-game-board-default-token ' + (cell.move ? 'move ' : '') + getBoardMoveElementHintClass(cell.move)"
            @click="!isComputerTurn && cell.move && store.dispatch(actionTypes.runMove, { move: cell.move.str })"
            :style="{ opacity: options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? cell.move.hintOpacity : 1 }">
              {{ cell.token }}
        </circle>
        
        <!-- Else use the svg corresponding to the move token. If no svg is mapped to the character, skip. -->
        
        <image
          v-else-if="Object.keys(pieces).includes(cell.token)"
            :x="(coords[0] - 0.5 * pieces[cell.token].scale) * 100 / backgroundGeometry[0]"
            :y="(coords[1] - 0.5 * pieces[cell.token].scale) * 100 / backgroundGeometry[0]"
            :width="(pieces[cell.token].scale) * 100 / backgroundGeometry[0]"
            :height="(pieces[cell.token].scale) * 100 / backgroundGeometry[0]"
            :href=pathPrefix+pieces[cell.token].image
            :class="'app-game-board-image-token ' + (cell.move ? 'move ' : '') + getBoardMoveElementHintClass(cell.move)"
            @click="!isComputerTurn && cell.move && store.dispatch(actionTypes.runMove, { move: cell.move.str })"
            :style="{ opacity: options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? cell.move.hintOpacity : 1 }">
              {{ cell.token }}
        </image>
      </g>
    </g>

    <!-- Draw M-type (arrow) moves. -->
    <g v-for="(arrow, i) in richPositionData.arrows" :key="'arrow' + i">
      <polyline
        :points="formatArrowPolylinePoints(arrow, 100 / backgroundGeometry[0])"
        :class="'app-game-board-default-arrow ' + getBoardMoveElementHintClass(arrow.move)"
        @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: arrow.move.str })"
        :style="{
          opacity: options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? arrow.move.hintOpacity : 1,
        }"
        :marker-end="getHintArrowMarker(arrow.move)" />
    </g>
  </svg>
</template>

<script lang="ts" setup>
  import { computed } from "vue";
  import { actionTypes, useStore } from "../../scripts/plugins/store";

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
    piece: string;
    token?: string;
    move?: GDefaultRegular2DMove;
  }

  interface GDefaultRegular2DBoardArrow {
    from: number;
    to: number;
    move: GDefaultRegular2DMove;
  }

  const store = useStore();
  const options = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.options : undefined));
  const showNextMoves = computed(() => (options.value ? options.value.showNextMoves : true));
  const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));
  const showNextMoveDeltaRemotenesses = computed(() => (options.value ? options.value.showNextMoveDeltaRemotenesses : true));
  const currentPosition = computed(() => store.getters.currentPosition.replace(/^;/, "").replace(/;$/, "").replace(/;/g, "\n").replace(/=/g, " = "));
  const currentAvailableMoves = computed(() => store.getters.currentAvailableMoves);
  const isComputerTurn = computed(() => store.getters.currentPlayer.id[0] === "c");

  /* Code Cleanup Required Here */
  const gameType = computed(() => store.getters.currentGameType);
  const gameId = computed(() => store.getters.currentGameId);
  const variantId = computed(() => store.getters.currentVariantId);
  const autoguiV2Data = computed(() => store.getters.variant(gameType.value, gameId.value, variantId.value).autogui_v2_data).value;
  const backgroundGeometry = autoguiV2Data.backgroundGeometry;
  const defaultTheme = autoguiV2Data.defaultTheme;
  const theHeight = backgroundGeometry[1] * 100 / backgroundGeometry[0];
  const pathPrefix = "../../../UNIv2/";
  const theTheme = autoguiV2Data.themes[defaultTheme];
  const backgroundImagePath = theTheme.backgroundImage;
  const centers = theTheme.centers;
  const pieces = theTheme.pieces;
  /* End Code Cleanup Required Here */

  const richPositionData = computed(() => {
    const position: string = currentPosition.value;
    const matches = position.match(/^R_(A|B)_([0-9]+)_([0-9]+)_([a-zA-Z0-9-\*]+)(?:_(.*))?$/)!;
    const validRichPosition = matches && matches.length >= 5;
    if (validRichPosition) {
      const turn = matches[1] == "A" ? UWAPITurn.A : UWAPITurn.B;
      const board: GDefaultRegular2DBoardCell[] = matches[4].split("").map((piece) => ({ piece }));
      let arrows: GDefaultRegular2DBoardArrow[] = [];
      for (let nextMoveData of Object.values(currentAvailableMoves.value)) {
        const move = {
          str: nextMoveData.move,
          hint: nextMoveData.moveValue,
          hintOpacity: nextMoveData.moveValueOpacity,
        };
        let matches;
        if ((matches = nextMoveData.move.match(/^A_([a-zA-Z0-9-\*])_([0-9]+)$/))) {
          const to = parseInt(matches[2]);
          board[to].token = matches[1];
          board[to].move = move;
        } else if ((matches = nextMoveData.move.match(/^M_([0-9]+)_([0-9]+)$/))) {
          arrows.push({
            from: parseInt(matches[1]),
            to: parseInt(matches[2]),
            move,
          });
        } else {
          console.error("NOTREACHED");
        }
      }
      
      const calcRegular2DBoardTopLeftCoords = (i: number): [number, number] => {
        return centers[i];
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
        board,
        arrows,
        validRichPosition,
      };
    }

    return {
      validRichPosition
    }
  });

  const calcRegular2DBoardTopLeftCoords = (i: number): [number, number] => {
    return centers[i];
  };

  const formatArrowPolylinePoints = (arrow: GDefaultRegular2DBoardArrow, multiplier: number, startOffset: number = 2, endOffset: number = 3): string => {
    let fromCoords = calcRegular2DBoardTopLeftCoords(arrow.from).map((a: number) => (a) * multiplier);
    let toCoords = calcRegular2DBoardTopLeftCoords(arrow.to).map((a: number) => (a) * multiplier);
    const dir = [toCoords[0] - fromCoords[0], toCoords[1] - fromCoords[1]];
    const length = Math.sqrt(Math.pow(dir[0], 2) + Math.pow(dir[1], 2));
    const startOffsetPct = startOffset / length;
    const endOffsetPct = endOffset / length;
    fromCoords[0] += dir[0] * startOffsetPct;
    fromCoords[1] += dir[1] * startOffsetPct;
    toCoords[0] -= dir[0] * endOffsetPct;
    toCoords[1] -= dir[1] * endOffsetPct;
    return `${fromCoords[0]},${fromCoords[1]} ` + `${toCoords[0]},${toCoords[1]}`;
  };

  const getBoardMoveElementHintClass = (move?: GDefaultRegular2DMove): string => (move && options.value.showNextMoveHints ? "hint-" + move.hint : "");
  const getHintArrowMarker = (move?: GDefaultRegular2DMove): string => {
    if (!move) return "";
    if (options.value.showNextMoveHints) {
      return `url(#app-game-board-default-arrow-marker-${move.hint})`;
    }
    return "url(#app-game-board-default-arrow-marker)";
  };

</script>

<style lang="scss" scoped>

  @keyframes pulsing-arrow {
    0% {
      stroke-width: 1;
    }
    100% {
      stroke-width: 1.5;
    }
  }

  @keyframes pulsing-circle {
    0% {
      r: 2;
    }
    100% {
      r: 3;
    }
  }

  .app-game-board-default-token {
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

    &:hover {
      animation-name: pulsing-circle;
      animation-duration: 0.3s;
      animation-iteration-count: infinite;
      animation-timing-function: ease-in-out;
      animation-direction: alternate;
    }
  }

  .app-game-board-image-token {
    cursor: default;
    
    [data-turn="A"] &.move {
      filter: var(--turn1Filter);
    }
    [data-turn="B"] &.move {
      filter: var(--turn2Filter);
    }

    &.move.hint- {
      &win {
        filter: var(--winFilter);
      }
      &draw {
        filter: var(--drawFilter);
      }
      &tie {
        filter: var(--tieFilter);
      }
      &lose {
        filter: var(--loseFilter);
      }
    }
  }

  #app-game-board-default-arrow-marker {
    fill: var(--primaryColor);

    [data-turn="A"] & {
      fill: var(--turn1Color);
    }
    [data-turn="B"] & {
      fill: var(--turn2Color);
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
      stroke: var(--turn1Color);
    }
    [data-turn="B"] & {
      stroke: var(--turn2Color);
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
