<template>
  <!--Render board only if the boardstring is valid i.e. is a "validRichPosition". -->
  <svg
    v-if="richPositionData.validRichPosition" id="app-game-body-board-regular-2d-images"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="'-2 -2 ' + (scaledWidth + 4) + ' ' + (scaledHeight + 4)" 
    :data-turn="richPositionData.turn">

    <!-- Draw Background Image -->
    <image v-if="backgroundImagePath != ''"
      :width="scaledWidth"
      :height="scaledHeight"
      :href="getImageSource(backgroundImagePath)" />

    <!-- Draw M-type (arrow) moves below pieces. -->
    <g v-if="piecesOverArrows"> 
      <g v-for="(arrow, i) in richPositionData.arrows "
        :key="'arrow' + i">
        <polyline
          :points="formatArrowPolylinePoints(arrow, arrowThickness)"
          :class="'app-game-board-default-arrow ' + getBoardMoveElementHintClass(arrow.move)"
          @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: arrow.move.str })"
          :style="{
            opacity: options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? arrow.move.hintOpacity : 1,
          }"/>
      </g>
    </g>

    <!-- Draw Pieces on Board. -->
    <g v-for="(cell, i) in richPositionData.board"
      :key="'cell' + i">
      <image v-if="cell.piece != '-' && cell.piece != '*' && Object.keys(pieces).includes(cell.piece)"
        :id="'piece' + i"
        :x="centers[i][0] - 0.5 * pieces[cell.piece].scale * scaledWidth / backgroundGeometry[0]"
        :y="centers[i][1] - 0.5 * pieces[cell.piece].scale * scaledWidth / backgroundGeometry[0]"
        :width="pieces[cell.piece].scale * scaledWidth / backgroundGeometry[0]"
        :height="pieces[cell.piece].scale * scaledWidth / backgroundGeometry[0]"
        :href="getImageSource(pieces[cell.piece].image)" />
    </g>
 
    <!-- Draw Foreground Image -->
    <image v-if="foregroundImagePath != ''"
      :width="scaledWidth"
      :height="scaledHeight"
      :href="getImageSource(foregroundImagePath)" />

    <!-- Draw A-type Moves. -->
    <g v-for="(cell, i) in richPositionData.board" 
      :key="'cell' + i">
      <g v-if="cell.move">

        <!-- If no move token specified, use default move token (a circle). -->
        <circle v-if="cell.token == '-'"
            :cx="centers[i][0]"
            :cy="centers[i][1]"
            :r="defaultMoveTokenRadius"
            :class="'app-game-board-token ' + (cell.move ? 'move ' : '') + getBoardMoveElementHintClass(cell.move)"
            :style="'--xorigin: ' + centers[i][0] + 'px ' + centers[i][1] + 'px; opacity: ' + (options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? cell.move.hintOpacity : 1) + ';'"
            @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: cell.move.str })">
              {{ cell.token }}
        </circle>
        
        <!-- Else use the svg corresponding to the move token. If no svg is mapped to the character, skip. -->
        <image v-else-if="Object.keys(pieces).includes(cell.token)"
            :x="centers[i][0] - 0.5 * pieces[cell.token].scale * scaledWidth / backgroundGeometry[0]"
            :y="centers[i][1] - 0.5 * pieces[cell.token].scale * scaledWidth / backgroundGeometry[0]"
            :width="pieces[cell.token].scale * scaledWidth / backgroundGeometry[0]"
            :height="pieces[cell.token].scale * scaledWidth / backgroundGeometry[0]"
            :href="getImageSource(pieces[cell.token].image)"
            :class="'app-game-board-token ' + (cell.move ? 'move ' : '') + getBoardMoveElementHintClass(cell.move)"
            :style="'--xorigin: ' + centers[i][0] + 'px ' + centers[i][1] + 'px; opacity: ' + (options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? cell.move.hintOpacity : 1) + ';'"
            @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: cell.move.str })">
              {{ cell.token }}
        </image>
      </g>
    </g>

    <!-- Draw M-type (arrow) moves on top of pieces. -->
    <g v-if="!piecesOverArrows"> 
      <g v-for="(arrow, i) in richPositionData.arrows "
        :key="'arrow' + i">
        <polyline
          :points="formatArrowPolylinePoints(arrow, arrowThickness)"
          :class="'app-game-board-default-arrow ' + getBoardMoveElementHintClass(arrow.move)"
          @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: arrow.move.str })"
          :style="{
            opacity: options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? arrow.move.hintOpacity : 1,
          }"/>
      </g>
    </g>

    <!-- Draw L-type (line) moves. -->
    <g v-for="(line, i) in richPositionData.lines"
      :key="'line' + i">
      <line
        :x1="centers[line.from][0]"
        :y1="centers[line.from][1]"
        :x2="centers[line.to][0]"
        :y2="centers[line.to][1]"
        :stroke-linecap="'round'"
        :stroke-width="lineWidth"
        :class="'app-game-board-default-arrow ' + getBoardMoveElementHintClass(line.move)"
        @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: line.move.str })"
        :style="{
          opacity: options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? line.move.hintOpacity : 1,
        }" />
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

  interface GDefaultRegular2DBoardLine {
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
  const defaultTheme = autoguiV2Data.defaultTheme;
  const theTheme = autoguiV2Data.themes[defaultTheme];
  const scaledWidth = 100;
  const backgroundGeometry = theTheme.backgroundGeometry;
  const scaledHeight = backgroundGeometry[1] * scaledWidth / backgroundGeometry[0];
  const imagePathPrefix = "../../models/images/svg/";
  const backgroundImagePath = theTheme.backgroundImage || "";
  const foregroundImagePath = theTheme.foregroundImage || "";
  const piecesOverArrows = theTheme.piecesOverArrows || false;
  const arrowThickness = (theTheme.arrowThickness * scaledWidth / backgroundGeometry[0] / 2) || 0.75;
  const lineWidth = theTheme.lineWidth || 0.9;
  const defaultMoveTokenRadius = (theTheme.defaultMoveTokenRadius * scaledWidth / backgroundGeometry[0]) || 2;
  const centers = theTheme.centers.map((a: [number, number]) => a.map((b: number) => b * scaledWidth / backgroundGeometry[0]));
  const pieces = theTheme.pieces;
  // Probably don't want ot reimport every time.
  const gimages = import.meta.globEager("../../models/images/svg/**/*");

  const getImageSource = (imagePath: string) => {
    try {
      return gimages["../../models/images/svg/" + imagePath].default;
    } catch (errorMessage) {
      console.warn(`${imagePath} image does not exist yet.`);
    }
    return import.meta.globEager("../../models/images/logo-gamescrafters.png")["../../models/images/logo-gamescrafters.png"].default;
  };
  /* End Code Cleanup Required Here */

  const richPositionData = computed(() => {
    const position: string = currentPosition.value;
    const matches = position.match(/^R_(A|B)_([0-9]+)_([0-9]+)_([a-zA-Z0-9-\*]+)(?:_(.*))?$/)!;
    const validRichPosition = matches && matches.length >= 5;
    if (validRichPosition) {
      const turn = matches[1] == "A" ? UWAPITurn.A : UWAPITurn.B;
      const board: GDefaultRegular2DBoardCell[] = matches[4].split("").map((piece) => ({ piece }));
      let arrows: GDefaultRegular2DBoardArrow[] = [];
      let lines: GDefaultRegular2DBoardLine[] = [];
      for (let nextMoveData of Object.values(currentAvailableMoves.value)) {        
        const move = {
          str: nextMoveData.move,
          hint: nextMoveData.moveValue,
          hintOpacity: nextMoveData.moveValueOpacity,
        };

        let matches;
        if ((matches = nextMoveData.move.match(/^A_([a-zA-Z0-9-\*])_([0-9]+)*/))) {
          const to = parseInt(matches[2]);
          board[to].token = matches[1];
          board[to].move = move;
        } else if ((matches = nextMoveData.move.match(/^M_([0-9]+)_([0-9]+)*/))) {
          arrows.push({
            from: parseInt(matches[1]),
            to: parseInt(matches[2]),
            move,
          });
        } else if ((matches = nextMoveData.move.match(/^L_([0-9]+)_([0-9]+)*/))) {
          lines.push({
            from: parseInt(matches[1]),
            to: parseInt(matches[2]),
            move,
          });
        } else {
          console.error("NOTREACHED");
        }
      }
      
      const computeSquaredLength = (ax: number, ay: number, bx: number, by: number): number => {
        return Math.pow(ax - bx, 2) + Math.pow(ay - by, 2);
      };

      const compareArrowSquaredLength = (a: GDefaultRegular2DBoardArrow, b: GDefaultRegular2DBoardArrow): number => {
        const aFromCoords = centers[a.from];
        const aToCoords = centers[a.to];
        const bFromCoords = centers[b.from];
        const bToCoords = centers[b.to];
        return computeSquaredLength(bFromCoords[0], bFromCoords[1], bToCoords[0], bToCoords[1]) - computeSquaredLength(aFromCoords[0], aFromCoords[1], aToCoords[0], aToCoords[1]);
      };

      arrows = arrows.sort(compareArrowSquaredLength);

      return {
        turn: turn,
        board,
        arrows,
        lines,
        validRichPosition,
      };
    }

    return {
      validRichPosition
    }
  });

  const formatArrowPolylinePoints = (arrow: GDefaultRegular2DBoardArrow, thickness: number = 0.75, startOffset: number = 2, endOffset: number = 2): string => {
    let fromCoords = centers[arrow.from].map((a: number) => (a));
    let coords3 = centers[arrow.to].map((a: number) => (a));
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
  
</script>

<style lang="scss" scoped>

  #app-game-body-board-regular-2d-images {
    height: 100%;
    width: 100%;
  }

  @keyframes pulsing-arrow {
    0% {
      stroke-width: 1;
    }
    100% {
      stroke-width: 1.5;
    }
  }

  @keyframes pulsing-image {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.2);
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

  .app-game-board-token {
    cursor: default;
    transform-origin: var(--xorigin);
    
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

    &:hover {
      animation-name: pulsing-image;
      animation-duration: 0.3s;
      animation-iteration-count: infinite;
      animation-timing-function: ease-in-out;
      animation-direction: alternate;
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
    height: 20em;
    width: 20em;
    margin: auto;
    vertical-align: middle;
  }

</style>
