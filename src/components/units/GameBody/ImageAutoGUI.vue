<template>
  <!-- Render board only if the boardstring is valid i.e. is a "validRichPosition". -->
  <svg v-if="richPositionData.validRichPosition"
    id="image-autogui"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="'-2 -2 ' + (scaledWidth + 4) + ' ' + (scaledHeight + 4)" 
    :data-turn="richPositionData.turn">

    <!-- Draw Background Image -->
    <image v-if="backgroundImagePath != ''"
      :width="scaledWidth"
      :height="scaledHeight"
      :href="getImageSource(backgroundImagePath)"/>

    <!-- Draw M-type (arrow) move buttons below pieces. -->
    <g v-if="showMoveButtons && piecesOverArrows"> 
      <g v-for="(arrow, i) in richPositionData.arrows" :key="'arrow' + i">
        <polyline
          :points="formatArrowPolylinePoints(arrow, arrowThickness)"
          :class="'app-game-board-default-arrow ' + getBoardMoveElementHintClass(arrow.move)"
          @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: arrow.move.str })"
          :style="{
            opacity: options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? arrow.move.hintOpacity : 1,
          }"/>
      </g>
    </g>

    <!-- Draw Pieces. -->
    <g v-for="(cell, i) in richPositionData.board" :key="'cell' + i">
      <image v-if="cell != '-' && Object.keys(pieces).includes(cell)"
        :id="'piece' + i"
        :x="centers[i][0] - 0.5 * pieces[cell].scale * widthFactor"
        :y="centers[i][1] - 0.5 * pieces[cell].scale * widthFactor"
        :class="'entity'"
        :width="pieces[cell].scale * widthFactor"
        :height="pieces[cell].scale * widthFactor"
        :opacity="origOpacity"
        :href="getImageSource(pieces[cell].image)"/>
    </g>
 
    <!-- Draw Foreground Image -->
    <image v-if="foregroundImagePath != ''"
      :width="scaledWidth"
      :height="scaledHeight"
      :href="getImageSource(foregroundImagePath)"/>

    <g v-if="showMoveButtons">
      <!-- Draw A-type move buttons. -->
      <g v-for="(token, i) in richPositionData.tokens" :key="'token' + i">
        <g v-if="token.move">
          <!-- If no move token specified, use default move button (a circle). -->
          <circle v-if="token.token == '-'"
              :cx="centers[token.to][0]"
              :cy="centers[token.to][1]"
              :r="defaultMoveTokenRadius"
              :class="'app-game-board-default-button ' + (token.move ? 'move ' : '') + getBoardMoveElementHintClass(token.move)"
              :style="'--xorigin: ' + centers[token.to][0] +
                      'px ' + centers[token.to][1] +
                      'px; opacity: ' + (options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? token.move.hintOpacity : 1) +
                      ';'"
              @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: token.move.str })"/>
          
          <!-- Else use the svg corresponding to the move token. If no svg is mapped to the character, skip. -->
          <g v-else-if="Object.keys(pieces).includes(token.token)">
            <mask :id="'svgmask' + i">
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
                centers[token.to][1] + 'px; opacity: ' + 
                (options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? token.move.hintOpacity : 1) +
                ';mask: url(#svgmask' + i + ');'"
              @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: token.move.str })"/>
          </g>
        </g>
      </g>

      <!-- Draw M-type (arrow) move buttons on top of pieces. -->
      <g v-if="!piecesOverArrows"> 
        <g v-for="(arrow, i) in richPositionData.arrows " :key="'arrow' + i">
          <polyline
            :points="formatArrowPolylinePoints(arrow, arrowThickness)"
            :class="'app-game-board-default-arrow ' + getBoardMoveElementHintClass(arrow.move)"
            @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: arrow.move.str })"
            :style="{
              opacity: options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? arrow.move.hintOpacity : 1,
            }"/>
        </g>
      </g>

      <!-- Draw L-type (line) move buttons. -->
      <g v-for="(line, i) in richPositionData.lines" :key="'line' + i">
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
          }"/>
      </g>

    </g>
  </svg>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from "vue";
  import { actionTypes, useStore } from "../../../scripts/plugins/store";
  import gsap from "gsap";
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
    nextPosition: string;
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

  interface GDefaultRegular2DBoardLine {
    from: number;
    to: number;
    move: GDefaultRegular2DMove;
  }

  const store = useStore();
  const options = computed(() => store.getters.options);
  const currentPosition = computed(() => store.getters.currentPosition);
  const currentAvailableMoves = computed(() => store.getters.currentAvailableMoves);
  const isComputerTurn = computed(() => store.getters.currentPlayer.isComputer);

  /* Code Cleanup Required Here */
  const autoguiV2Data = computed(() => store.getters.autoguiV2Data(store.getters.currentGameType, 
    store.getters.currentGameId, store.getters.currentVariantId));
  const currentTheme = computed(() => store.getters.currentGameTheme);
  const theTheme = computed(() => autoguiV2Data.value.themes[currentTheme.value]);
  const scaledWidth = 100;
  const backgroundGeometry = computed(() => theTheme.value.backgroundGeometry);
  const widthFactor = computed(() => scaledWidth / backgroundGeometry.value[0]);
  const scaledHeight = computed(() => backgroundGeometry.value[1] * widthFactor.value);
  const backgroundImagePath = computed(() => theTheme.value.backgroundImage || "");
  const foregroundImagePath = computed(() => theTheme.value.foregroundImage || "");
  const piecesOverArrows = computed(() => theTheme.value.piecesOverArrows || false);
  const animationType = computed(() => theTheme.value.animationType || "");
  const arrowThickness = computed(() =>
    (theTheme.value.arrowThickness * widthFactor.value / 2) || 1.5);
  const lineWidth = computed(() => theTheme.value.lineWidth || 0.9);
  const defaultMoveTokenRadius = computed(() =>
    (theTheme.value.defaultMoveTokenRadius * widthFactor.value) || 2);
  const pieces = computed(() => theTheme.value.pieces);
  const centers = computed(() =>
    theTheme.value.centers.map((a: [number, number]) =>
      a.map((b: number) => b * widthFactor.value)));

  const showMoveButtons = ref(true);

  gsap.config({ nullTargetWarn: false }); // Suppress target-not-found warnings.
  const origOpacity = computed(() => {
    showMoveButtons.value = true;
    gsap.to(".entity", {duration: 0.001, opacity: 1});
    return currentPosition.value ? 1 : 1;
  });

  const transitionTo = computed(() => store.getters.currentTransitionTo);

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
      const board = matches[4];
      let tokens: GDefaultRegular2DBoardToken[] = [];
      let arrows: GDefaultRegular2DBoardArrow[] = [];
      let lines: GDefaultRegular2DBoardLine[] = [];
      for (let nextMoveData of Object.values(currentAvailableMoves.value)) {        
        const move = {
          str: nextMoveData.move,
          hint: nextMoveData.moveValue,
          hintOpacity: nextMoveData.moveValueOpacity,
          nextPosition: nextMoveData.position
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
        lines,
        validRichPosition,
      };
    }

    return {
      validRichPosition
    }
  });

  /* An arrow move button is a heptagon. We have decided that all arrowheads must be 55-55-70 triangles. 
  Given the arrow's endpoint and thickness (and other parameters `startOffset` and `endOffset`), return 
  the vertex coordinates of the arrow move button as a string. */
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

  watch(transitionTo, (newValue: any, oldValue: any) => {
    showMoveButtons.value = false;
    if (Boolean(newValue) == false || Boolean(oldValue) == false) return;
    const currBoard = oldValue.split("_")[4];
    const nextBoard = newValue.split("_")[4];
    if (currBoard.length != nextBoard.length) return;
    var diffIdxs = [];
    var i, j;

    if (animationType.value === "simpleSlidePlaceRemove") {
      var fromIdx = null;
      var toIdx = null;
      var appearDisappearIdx = null;
      var appearing = null;
      for (i = 0; i < currBoard.length; i++) {
        if (currBoard[i] != nextBoard[i]) {
          diffIdxs.push(i);
        }
      }

      if (diffIdxs.length == 1) {
        i = diffIdxs[0];
        if (nextBoard[i] == '-') { // Removal (fade-out)
          appearing = false;
        } else if (currBoard[i] == '-') { // Placement (fade-in)
          appearing = true;
        } else {
          return;
        }
        appearDisappearIdx = i;
      } else if (diffIdxs.length == 2) {
        i = diffIdxs[0];
        j = diffIdxs[1];
        if (currBoard[j] == nextBoard[i] && currBoard[j] != '-') {
          i = j;
          j = diffIdxs[0];
        }
        if (currBoard[i] == nextBoard[j]) {
          if (currBoard[j] != '-' && nextBoard[i] != '-') {
            return;
          } else if (currBoard[j] != '-') { // Capture
            appearDisappearIdx = j;
            appearing = false;
          } else if (nextBoard[i] != '-') { // Uncapture
            appearDisappearIdx = i;
            appearing = true;
          }
          fromIdx = i;
          toIdx = j;
        } else {
          return;
        }
      } else if (diffIdxs.length == 3) {
        for (const idx1 of diffIdxs) {
          for (const idx2 of diffIdxs) {
            if (currBoard[idx1] == nextBoard[idx2] && currBoard[idx1] != '-') {
              fromIdx = idx1;
              toIdx = idx2;
            }
          }
        }
        if (fromIdx == null) {
          return;
        }
        for (const idx of diffIdxs) {
          if (fromIdx != idx && toIdx != idx) {
            appearDisappearIdx = idx;
          }
        }
        if (currBoard[appearDisappearIdx!] == '-') {
          appearing = true;
        } else if (nextBoard[appearDisappearIdx!] == '-') {
          appearing = false;
        } else {
          return;
        }
      } else {
        return;
      }

      console.log("entering watch " + appearing + " " + fromIdx + " " + toIdx + " " + appearDisappearIdx);

      if (fromIdx != null && toIdx != null) { // Play sliding animation
        const toCoords = centers.value[toIdx];
        const fromCoords = centers.value[fromIdx];
        gsap.to("#piece" + fromIdx, {duration: 0.5, x: toCoords[0] - fromCoords[0], y: toCoords[1] - fromCoords[1]});
      }
      
      // If `appearing` is null, don't play an appearing or disappearing animation
      if (appearing === false) { // Play disappearing animation
        gsap.to("#piece" + appearDisappearIdx, {duration: 0.5, autoAlpha: 0.01});
      } else if (appearing === true) { // Play appearing animation
        console.log("appear");
      }
    } else if (animationType.value === "custom") {
      console.log("Custom");
    }
  });
  
</script>

<style lang="scss" scoped>

  #image-autogui {
    height: 100%;
    width: 100%;
  }

  @keyframes pulsing-arrow {
    0% { stroke-width: 1; }
    100% { stroke-width: 1.5; }
  }

  @keyframes pulsing-token {
    0% { transform: scale(1); }
    100% { transform: scale(1.2); }
  }

  .app-game-board-default-button {
    cursor: default;
    transform-origin: var(--xorigin);
    
    [data-turn="A"] &.move {
      fill: var(--turn1Color);
    }
    [data-turn="B"] &.move {
      fill: var(--turn2Color);
    }

    &.move.hint- {
      &win      { fill: var(--winColor); }
      &draw     { fill: var(--drawColor); }
      &tie      { fill: var(--tieColor); }
      &lose     { fill: var(--loseColor); }
      &unsolved { fill: var(--unsolvedColor); }
    }

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
      &unsolved {
        stroke: var(--unsolvedColor);
        fill: var(--unsolvedColor)
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