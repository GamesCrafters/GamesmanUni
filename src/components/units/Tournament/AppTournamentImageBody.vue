<template>
  <!--Render board only if the boardstring is valid i.e. is a "validRichPosition". -->
  <svg v-if="richPositionData.validRichPosition"
    id="app-tournament-image-body"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="'-2 -2 ' + (scaledWidth + 4) + ' ' + (scaledHeight + 4)" 
    :data-turn="richPositionData.turn">

    <!-- Draw Background Image -->
    <image v-if="backgroundImagePath != ''"
      :width="scaledWidth"
      :height="scaledHeight"
      :href="getImageSource(backgroundImagePath)"
    />

    <g v-if="!isComputerTurn"> 
      <g v-for="(arrow, i) in richPositionData.arrows " :key="'arrow' + i">
        <polyline
          :points="formatArrowPolylinePoints(arrow, arrowThickness)"
          :class="'app-game-board-default-arrow ' + getBoardMoveElementHintClass(arrow.move)"
          @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: arrow.move.str })"
        />
      </g>
    </g>

    <!-- Draw Pieces on Board. -->
    <g v-for="(cell, i) in richPositionData.board" :key="'cell' + i">
      <image v-if="cell.piece != '-' && cell.piece != '*' && Object.keys(pieces).includes(cell.piece)"
        :id="'piece' + i"
        :x="centers[i][0] - 0.5 * pieces[cell.piece].scale * widthFactor"
        :y="centers[i][1] - 0.5 * pieces[cell.piece].scale * widthFactor"
        :width="pieces[cell.piece].scale * widthFactor"
        :height="pieces[cell.piece].scale * widthFactor"
        :href="getImageSource(pieces[cell.piece].image)"
      />
    </g>
 
    <!-- Draw Foreground Image -->
    <image v-if="foregroundImagePath != ''"
      :width="scaledWidth"
      :height="scaledHeight"
      :href="getImageSource(foregroundImagePath)"
    />

    <!-- Draw A-type Moves. -->
    <g v-if="!isComputerTurn">
      <g v-for="(token, i) in richPositionData.tokens" :key="'token' + i">
        <g v-if="token.move">
          <!-- If no move token specified, use default move token (a circle). -->
          <circle v-if="token.token == '-'"
              :cx="centers[token.to][0]"
              :cy="centers[token.to][1]"
              :r="defaultMoveTokenRadius"
              :class="'app-game-board-default-button ' + (token.move ? 'move ' : '') + getBoardMoveElementHintClass(token.move)"
              :style="'--xorigin: ' + centers[token.to][0] +
                      'px ' + centers[token.to][1] +
                      'px;'"
              @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: token.move.str })"
          />
          
          <!-- Else use the svg corresponding to the move token. If no svg is mapped to the character, skip. -->
          <g v-else-if="Object.keys(pieces).includes(token.token)">
            <mask
              :id="'svgmask' + i">
              <image
                :x="centers[token.to][0] - 0.5 * pieces[token.token].scale * widthFactor"
                :y="centers[token.to][1] - 0.5 * pieces[token.token].scale * widthFactor"
                :width="pieces[token.token].scale * widthFactor"
                :height="pieces[token.token].scale * widthFactor"
                :href="getImageSource(pieces[token.token].image)"/>
            </mask>
            <rect
              :x="centers[token.to][0] - 0.5 * pieces[token.token].scale * widthFactor"
              :y="centers[token.to][1] - 0.5 * pieces[token.token].scale * widthFactor"
              :width="pieces[token.token].scale * widthFactor" 
              :height="pieces[token.token].scale * widthFactor"
              :class="'app-game-board-default-button ' + (token.move ? 'move ' : '') + getBoardMoveElementHintClass(token.move)"
              :style="'--xorigin: ' + centers[token.to][0] + 'px ' + 
                centers[token.to][1] + 'px; mask: url(#svgmask' + i + ');'"
              @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: token.move.str })"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
  <h1 v-if="swanCount > 0">Swans Left to Place: {{swanCount}}</h1>
</template>

<script lang="ts" setup>
  import { computed } from "vue";
  import { actionTypes, useStore } from "../../../scripts/plugins/store";
  const gimages = import.meta.globEager("../../../models/images/svg/**/*");
  const logo = import.meta.globEager("../../../models/images/logo-gamescrafters.png");

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
  }

  interface GDefaultRegular2DBoardToken {
    token: string;
    to: number;
    move: GDefaultRegular2DMove;
  }

  interface GDefaultRegular2DBoardArrow {
    from: number;
    to: number;
    move: GDefaultRegular2DMove;
  }

  const store = useStore();
  const options = computed(() => store.getters.options);
  const currentPosition = computed(() =>
    store.getters.currentPosition.replace(/^;/, "")
                                 .replace(/;$/, "")
                                 .replace(/;/g, "\n")
                                 .replace(/=/g, " = ")
  );
  const currentAvailableMoves = computed(() => store.getters.currentAvailableMoves);
  const isComputerTurn = computed(() => store.getters.currentPlayer.isComputer);

  /* Code Cleanup Required Here */
  const gameType = computed(() => store.getters.currentGameType);
  const gameId = computed(() => store.getters.currentGameId);
  const variantId = computed(() => store.getters.currentVariantId);
  const autoguiV2Data = computed(() =>
    store.getters.autoguiV2Data(gameType.value, gameId.value, variantId.value));
  const currentTheme = computed(() => store.getters.currentGameTheme);
  const theTheme = computed(() => autoguiV2Data.value.themes[currentTheme.value]);
  const scaledWidth = 100;
  const backgroundGeometry = computed(() => theTheme.value.backgroundGeometry);
  const widthFactor = computed(() => scaledWidth / backgroundGeometry.value[0]);
  const scaledHeight = computed(() => backgroundGeometry.value[1] * widthFactor.value);
  const backgroundImagePath = computed(() => theTheme.value.backgroundImage || "");
  const foregroundImagePath = computed(() => theTheme.value.foregroundImage || "");
  const piecesOverArrows = computed(() => theTheme.value.piecesOverArrows || false);
  const arrowThickness = computed(() =>
    (theTheme.value.arrowThickness * widthFactor.value / 2) || 1.5);
  const lineWidth = computed(() => theTheme.value.lineWidth || 0.9);
  const defaultMoveTokenRadius = computed(() =>
    (theTheme.value.defaultMoveTokenRadius * widthFactor.value) || 2);
  const pieces = computed(() => theTheme.value.pieces);
  const centers = computed(() =>
    theTheme.value.centers.map((a: [number, number]) =>
      a.map((b: number) => b * widthFactor.value)));

  const swanCount = computed(() => {
    if (gameId.value === 'swans') {
      if (currentPosition.value[currentPosition.value.length - 2] != '=') {
        return currentPosition.value.slice(-2);
      } else {
        return currentPosition.value.slice(-1);
      }
    } else {
      return 0;
    }
  })

  const getImageSource = (imagePath: string) => {
    try {
      return gimages["../../../models/images/svg/" + imagePath].default;
    } catch (errorMessage) {
      console.warn(`${imagePath} image does not exist yet.`);
    }
    return logo["../../../models/images/logo-gamescrafters.png"].default;
  };
  /* End Code Cleanup Required Here */

  const richPositionData = computed(() => {
    const position: string = currentPosition.value;
    const matches = position.match(/^R_(A|B)_([0-9]+)_([0-9]+)_([a-zA-Z0-9-\*]+)*/)!;
    const validRichPosition = matches && matches.length >= 5;
    if (validRichPosition) {
      const turn = matches[1] == "A" ? UWAPITurn.A : UWAPITurn.B;
      const board: GDefaultRegular2DBoardCell[] = matches[4].split("").map((piece) => ({ piece }));
      let tokens: GDefaultRegular2DBoardToken[] = [];
      let arrows: GDefaultRegular2DBoardArrow[] = [];
      for (let nextMoveData of Object.values(currentAvailableMoves.value)) {        
        const move = {
          str: nextMoveData.move,
          hint: nextMoveData.moveValue,
          hintOpacity: nextMoveData.moveValueOpacity,
        };

        let matches;
        if ((matches = nextMoveData.move.match(/^A_([a-zA-Z0-9-\*])_([0-9]+)*/))) {
          const to = parseInt(matches[2]);
          tokens.push({
            token: matches[1],
            to: to,
            move: move,
          })
        } else if ((matches = nextMoveData.move.match(/^M_([0-9]+)_([0-9]+)*/))) {
          arrows.push({
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

      const compareArrowSquaredLength = 
          (a: GDefaultRegular2DBoardArrow, b: GDefaultRegular2DBoardArrow): number => {
        const aFromCoords = centers.value[a.from];
        const aToCoords = centers.value[a.to];
        const bFromCoords = centers.value[b.from];
        const bToCoords = centers.value[b.to];
        return computeSquaredLength(bFromCoords[0], bFromCoords[1], bToCoords[0], bToCoords[1]) - 
               computeSquaredLength(aFromCoords[0], aFromCoords[1], aToCoords[0], aToCoords[1]);
      };

      arrows = arrows.sort(compareArrowSquaredLength);

      return {
        turn: turn,
        board,
        tokens,
        arrows,
        validRichPosition,
      };
    }

    return {
      validRichPosition
    }
  });

  const formatArrowPolylinePoints = 
      (arrow: GDefaultRegular2DBoardArrow,
      thickness: number = 0.75,
      startOffset: number = 2,
      endOffset: number = 2): string => {
    let fromCoords = centers.value[arrow.from].map((a: number) => (a));
    let coords3 = centers.value[arrow.to].map((a: number) => (a));
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

    return `${coords0[0]},${coords0[1]}
            ${coords1[0]},${coords1[1]}
            ${coords2[0]},${coords2[1]}
            ${coords3[0]},${coords3[1]}
            ${coords4[0]},${coords4[1]}
            ${coords5[0]},${coords5[1]}
            ${coords6[0]},${coords6[1]}`;
  };

  const getBoardMoveElementHintClass = 
    (move?: GDefaultRegular2DMove): string => 
      (move && options.value.showNextMoveHints ? "hint-" + move.hint : "");
  
</script>

<style lang="scss" scoped>

  #app-tournament-image-body {
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

  @keyframes pulsing-token {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.2);
    }
  }

  .app-game-board-default-button {
    cursor: default;
    transform-origin: var(--xorigin);
    
    fill: var(--unsolvedColor);

    &:hover {
      animation-name: pulsing-token;
      animation-duration: 0.3s;
      animation-iteration-count: infinite;
      animation-timing-function: ease-in-out;
      animation-direction: alternate;
    }
  }

  .app-game-board-default-arrow {
    stroke: var(--primaryColor);
    fill: var(--primaryColor);

    stroke: var(--unsolvedColor);
    fill: var(--unsolvedColor);

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
