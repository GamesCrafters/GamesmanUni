<template>
  <!-- Render position only if the autogui position string is valid. -->
  <svg v-if="autoguiPositionData.isValidAutoguiPositionString"
    id="image-autogui" xmlns="http://www.w3.org/2000/svg"
    :viewBox="'-2 -2 ' + (scaledWidth + 4) + ' ' + (scaledHeight + 4)" 
    :data-turn="autoguiPositionData.turn">

    <!-- Draw Background Image -->
    <image v-if="'background' in theme" x="0" y="0"
      :width="scaledWidth" :height="scaledHeight"
      :href="getImageSource(theme.background)"/>

    <!-- Draw M-type (arrow) move buttons below entities -->
    <template v-if="!animationPlaying && entitiesOverArrows"> 
      <path v-for="(arrow, i) in autoguiPositionData.arrows" :key="'arrow' + i"
        :d="formatArrowPathPoints(arrow, arrowWidth)"
        :class="'iag-button-arrow ' + getBoardMoveElementHintClass(arrow.move)"
        :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? arrow.move.hintOpacity : 1"
        @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: arrow.move.str })">
        <title>{{ moveButtonTitle(arrow.move.str) }}</title>
      </path>
    </template>

    <!-- Draw Regular (Image) Entities -->
    <g v-for="(entity, i) in autoguiPositionData.board" :key="'entity' + i">
      <image class="entity" v-if="entity != '-' && entity in charImages"
        :id="'entity' + i"
        :x="centers[i][0] - 0.5 * charImages[entity].scale * widthFactor"
        :y="centers[i][1] - 0.5 * charImages[entity].scale * widthFactor"
        :width="charImages[entity].scale * widthFactor"
        :height="charImages[entity].scale * widthFactor"
        :href="getImageSource(charImages[entity].image)"/>
    </g>

    <!-- Draw Text Entities -->
    <text v-for="(value, i) of autoguiPositionData.textEntities" :key="'entity' + i"
      class="entity" :id="'entity' + i" :x="centers[i][0]" :y="centers[i][1]" 
      :style="'font-size:' + textEntityFontSize + 'px;'">
      {{ value }}
    </text>
 
    <!-- Draw Foreground Image -->
    <image v-if="'foreground' in theme" x="0" y="0"
      :width="scaledWidth" :height="scaledHeight"
      :href="getImageSource(theme.foreground)"/>

    <template v-if="!animationPlaying">
      <!-- Draw A-type move buttons. -->
      <g v-for="token in autoguiPositionData.tokens" :key="token.move.str">
        <g v-if="token.move">  
          <!-- Use svg corresponding to move token. If no svg is mapped to the character, skip. -->
          <g v-if="token.token in charImages">
            <use 
              :x="centers[token.center][0] - 0.5 * charImages[token.token].scale * widthFactor"
              :y="centers[token.center][1] - 0.5 * charImages[token.token].scale * widthFactor"
              :width="charImages[token.token].scale * widthFactor" 
              :height="charImages[token.token].scale * widthFactor"
              :class="'iag-button-point ' + (token.move ? 'move ' : '') + getBoardMoveElementHintClass(token.move)"
              :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? token.move.hintOpacity : 1"
              :style="'--tOrigin: ' + centers[token.center][0] + 'px ' + centers[token.center][1] + 'px'"
              :href="getImageSource(charImages[token.token].image) + '#MoveButtonSVG'"
              @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: token.move.str })">
              <title>{{ moveButtonTitle(token.move.str) }}</title>
            </use>
          </g>

          <!-- If no move token specified, use default move button (a circle). -->
          <circle v-else
            :cx="centers[token.center][0]" :cy="centers[token.center][1]"
            :stroke-width="0" :r="defaultMoveTokenRadius"
            :class="'iag-button-point ' + (token.move ? 'move ' : '') + getBoardMoveElementHintClass(token.move)"
            :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? token.move.hintOpacity : 1"
            :style="'--tOrigin: ' + centers[token.center][0] + 'px ' + centers[token.center][1] + 'px;'"
            @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: token.move.str })">
            <title>{{ moveButtonTitle(token.move.str) }}</title>
          </circle>
        </g>
      </g>

      <!-- Draw T-type (text) move buttons -->
      <text v-for="textButton in autoguiPositionData.textButtons" :key="textButton.move.str"
        :x="centers[textButton.center][0]" :y="centers[textButton.center][1]"
        :class="'iag-button-point ' + (textButton.move ? 'move ' : '') + getBoardMoveElementHintClass(textButton.move)"
        :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? textButton.move.hintOpacity : 1"
        :style="'font-size:' + textButtonFontSize + 'px;stroke:none;--tOrigin: ' + centers[textButton.center][0] + 'px ' + centers[textButton.center][1] + 'px'"
        @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: textButton.move.str })">
        {{ textButton.text }}
        <title>{{ moveButtonTitle(textButton.move.str) }}</title>
      </text>

      <!-- Draw M-type (arrow) move buttons on top of entities -->
      <template v-if="!entitiesOverArrows"> 
        <path v-for="arrow in autoguiPositionData.arrows " :key="arrow.move.str"
          :d="formatArrowPathPoints(arrow, arrowWidth)"
          :class="'iag-button-arrow ' + getBoardMoveElementHintClass(arrow.move)"
          :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? arrow.move.hintOpacity : 1"
          @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: arrow.move.str })">
          <title>{{ moveButtonTitle(arrow.move.str) }}</title>
        </path>
      </template>

      <!-- Draw L-type (line) move buttons. -->
      <line v-for="line in autoguiPositionData.lines" :key="line.move.str"
        :x1="centers[line.p1][0]" :y1="centers[line.p1][1]"
        :x2="centers[line.p2][0]" :y2="centers[line.p2][1]"
        :stroke-linecap="'round'"
        :style="'--w: ' + lineWidth * widthFactor + ';--w2: ' + (lineWidth * widthFactor * 1.75) + ';'"
        :stroke-width="lineWidth * widthFactor"
        :class="'iag-button-line ' + getBoardMoveElementHintClass(line.move)"
        :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? line.move.hintOpacity : 1"
        @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: line.move.str })">
        <title>{{ moveButtonTitle(line.move.str) }}</title>
      </line>

      <!-- Draw MQ-type (quadratic bezier) move buttons. -->
      <path 
        v-for="quadraticBezier in autoguiPositionData.quadraticBeziers" 
        fill="none"
        :d="`M ${quadraticBezier.start.x} ${quadraticBezier.start.y} Q ${quadraticBezier.control.x} ${quadraticBezier.control.y} ${quadraticBezier.end.x} ${quadraticBezier.end.y}`" 
        :stroke-linecap="'round'"
        :style="'--w: ' + 2 + ';--w2: ' + (2 * 1.75) + ';'"
        :stroke-width="2"
        :class="'iag-button-quadraticbezier ' + getBoardMoveElementHintClass(quadraticBezier.move)"
        :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? quadraticBezier.move.hintOpacity : 1"
        @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: quadraticBezier.move.str })"
        :key="quadraticBezier.move.str"
      />

      <!-- Draw MC-type (cubic bezier) move buttons. -->
      <path 
        v-for="cubicBezier in autoguiPositionData.cubicBeziers" 
        fill="none"
        :d="`M ${cubicBezier.start.x} ${cubicBezier.start.y} C ${cubicBezier.control1.x} ${cubicBezier.control1.y}, ${cubicBezier.control2.x} ${cubicBezier.control2.y}, ${cubicBezier.end.x} ${cubicBezier.end.y}`" 
        :stroke-linecap="'round'"
        :style="'--w: ' + 2 + ';--w2: ' + (2 * 1.75) + ';'"
        :stroke-width="2"
        :class="'iag-button-cubicbezier ' + getBoardMoveElementHintClass(cubicBezier.move)"
        :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? cubicBezier.move.hintOpacity : 1"
        @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: cubicBezier.move.str })"
        :key="cubicBezier.move.str"
      />

      <!-- Draw MA-type (elliptical arc) move buttons. -->
      <path 
        v-for="ellipticalArc in autoguiPositionData.ellipticalArcs"
        fill="none"
        :d="`M ${ellipticalArc.start.x} ${ellipticalArc.start.y} A ${ellipticalArc.radiiX} ${ellipticalArc.radiiY} ${ellipticalArc.rotation} ${ellipticalArc.largeArcFlag} ${ellipticalArc.clockwiseSweepFlag} ${ellipticalArc.end.x} ${ellipticalArc.end.y}`" 
        :stroke-linecap="'round'"
        :style="'--w: ' + 2 + ';--w2: ' + (2 * 1.75) + ';'"
        :stroke-width="2"
        :class="'iag-button-ellipticalarc ' + getBoardMoveElementHintClass(ellipticalArc.move)"
        :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? ellipticalArc.move.hintOpacity : 1"
        @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: ellipticalArc.move.str })"
        :key="ellipticalArc.move.str"
      />
    </template>
  </svg>
  <div id="position-string" v-else>
    <!-- If cannot render position as image, display the position string instead. -->
    <h3>Current Position</h3>
    <pre>{{ currentPosition }}</pre>
  </div>
  <div id="listed-moves" v-if="options.showNextMoves && listedMoves.length">
    <!-- List all moves that do not have a proper AutoGUI move button. -->
    <h3>{{ autoguiPositionData.isValidAutoguiPositionString ? 'Other' : ''}} Available Moves</h3>
    <div id="moves">
      <div class="move" v-for="listedMove in listedMoves" :key="listedMove.move"
        :class="options.showNextMoveHints ? `uni-${listedMove.moveValue}` : ''"
        :style="{ opacity: options.showNextMoveDeltaRemotenesses ? listedMove.moveValueOpacity : 1 }"
        @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: listedMove.autoguiMove })">{{ listedMove.move }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from "vue";
  import { actionTypes, useStore } from "../../../scripts/plugins/store";
  import { defaultImageAutoGUITheme } from "../../../models/datas/defaultApp";
  const gimages = import.meta.globEager("../../../models/images/svg/**/*");

  interface IAGMove {
    str: string; // Autogui move string
    hint: string;
    hintOpacity: number;
    nextPosition: string;
  }

  interface IAGPointButton {
    token: string;
    center: number;
    move: IAGMove;
  }

  interface IAGArrowButton {
    from: number;
    to: number;
    move: IAGMove;
  }

  interface IAGLineButton {
    p1: number;
    p2: number;
    move: IAGMove;
  }

  interface IAGTextButton {
    text: string;
    center: number;
    move: IAGMove;
  }

  interface Point {
    x: number;
    y: number;
  }

  interface IAGQuadraticBezierButton {
    start: Point;
    control: Point;
    end: Point;
    move: IAGMove;
  }

  interface IAGCubicBezierButton {
    start: Point;
    control1: Point;
    control2: Point;
    end: Point;
    move: IAGMove;
  }

  interface IAGEllipticalArcButton {
    start: Point;
    radiiX: number;
    radiiY: number;
    rotation: number;
    largeArcFlag: number;
    clockwiseSweepFlag: number;
    end: Point;
    move: IAGMove;
  }

  const store = useStore();
  const options = computed(() => store.getters.options);
  const currentPosition = computed(() => store.getters.currentPosition);
  const currentAutoguiPosition = computed(() => store.getters.currentAutoguiPosition);
  const currentAvailableMoves = computed(() => store.getters.currentAvailableMoves);
  const movesAreClickable = computed(() => !(store.getters.currentPlayer.isComputer || (options.value.automoveIfSingleMove && Object.keys(currentAvailableMoves.value).length == 1)));
  const getImageSource = (imagePath: string) => gimages["../../../models/images/svg/" + imagePath].default;
  const scaledWidth = 100;
  const animationPlaying = computed(() => store.getters.animationPlaying);

  const imageAutoGUIData = computed(() => store.getters.imageAutoGUIData(store.getters.currentGameId, store.getters.currentVariantId));
  const theme = computed(() => {
    const iadata = imageAutoGUIData.value;
    if (iadata != null && store.getters.currentGameTheme in iadata.themes) {
      return iadata.themes[store.getters.currentGameTheme]
    } else {
      return defaultImageAutoGUITheme;
    }
  });
  const widthFactor = computed(() => scaledWidth / theme.value.space[0]);
  const scaledHeight = computed(() => theme.value.space[1] * widthFactor.value);
  const charImages = computed(() => theme.value.charImages);
  const centers = computed(() => theme.value.centers.map((a: Array<number>) => a.map((b: number) => b * widthFactor.value)));
  const arrowWidth = computed(() => (theme.value.arrowWidth * widthFactor.value / 2) || 1.5);
  const lineWidth = computed(() => theme.value.lineWidth || 0.04);
  const defaultMoveTokenRadius = computed(() => (theme.value.circleButtonRadius * widthFactor.value) || 2);
  const entitiesOverArrows = computed(() => theme.value.entitiesOverArrows || false);
  const textEntityFontSize = computed(() => theme.value.textEntityFontSize * widthFactor.value || 10);
  const textButtonFontSize = computed(() => theme.value.textButtonFontSize * widthFactor.value || 10);

  /**
   * Parses a series of points from the 'parsedData' array, dependant of the positioning mode. Given the 'X' positioning mode highlights
   * that a parameter is a single value and not a point, this value is stored in the x-component of the point and the y component is
   * attributed a value of -1 ({x: value, y: -1}).
   * @param {string} positioningModeSubstring - A string where each character represents the positioning mode of one parameter.
   * 'A' - Absolute
   * 'C' - Center
   * 'R' - Center-Relative
   * 'X' - Non-positioning parameter
   * @param {number[]} parsedData - Array of numbers.
   * @returns {Point[]} - Array of points.
   */
  const parseAbsolutePoints = (positioningModeSubstring: string, parsedData: number[]): Point[] => {
        const points: Point[] = [];

        let dataIndex = 0;
        for (let i = 0; i < positioningModeSubstring.length; i++) {
          if (positioningModeSubstring[i] === 'A') {
              points.push({x: parsedData[dataIndex], y: parsedData[dataIndex + 1]});
              dataIndex += 2;
            } else if (positioningModeSubstring[i] === 'C') {
              let centerIndex = parsedData[dataIndex];
              points.push({x: centers.value[centerIndex][0], y: centers.value[centerIndex][1]});
              dataIndex += 1;
            } else if (positioningModeSubstring[i] === 'R') {
              let centerIndex = parsedData[dataIndex];
              let xOffset = parsedData[dataIndex + 1];
              let yOffset = parsedData[dataIndex + 2];
              points.push({x: centers.value[centerIndex][0] + xOffset, y: centers.value[centerIndex][1] + yOffset});
              dataIndex += 3;
            } else if (positioningModeSubstring[i] === 'X') {
              points.push({x: parsedData[dataIndex], y: -1});
              dataIndex += 1;
            }
        }

        return points;
      };

  const autoguiPositionData = computed(() => {
    const matches = currentAutoguiPosition.value.match(/^(1|2)_([a-zA-Z0-9-\.~]+)*/)!;
    const isValidAutoguiPositionString = matches && matches.length >= 3 && imageAutoGUIData.value != null;
    if (isValidAutoguiPositionString) {
      const turn = matches[1];
      const entityStringParts = matches[2].split("~");
      const board = entityStringParts[0];
      let tokens: IAGPointButton[] = [];
      let arrows: IAGArrowButton[] = [];
      let lines: IAGLineButton[] = [];
      let textButtons: IAGTextButton[] = [];
      let quadraticBeziers: IAGQuadraticBezierButton[] = [];
      let cubicBeziers: IAGCubicBezierButton[] = [];
      let ellipticalArcs: IAGEllipticalArcButton[] = [];
      let listedButtons = [];
      let textIndices = [];
      for (var i = 0; i < board.length; i++) {
        if (board[i] === ".") textIndices.push(i);
      }
      let textEntities: Record<number, string> = {};
      for (var i = 1; i < entityStringParts.length && i <= textIndices.length; i++) {
        textEntities[textIndices[i - 1]] = entityStringParts[i];
      }

      for (let moveObj of Object.values(currentAvailableMoves.value)) {        
        const move = {
          str: moveObj.autoguiMove,
          hint: moveObj.moveValue,
          hintOpacity: !options.value.showNextMoves ? 0.001 : moveObj.moveValueOpacity,
          nextPosition: moveObj.position
        };

        let matches;
        if ((matches = moveObj.autoguiMove.match(/^A_([a-zA-Z0-9-])_([0-9]+)*/))) {
          tokens.push({token: matches[1], center: parseInt(matches[2]), move});
        } else if ((matches = moveObj.autoguiMove.match(/^M_([0-9]+)_([0-9]+)*/))) {
          arrows.push({from: parseInt(matches[1]), to: parseInt(matches[2]), move});
        } else if ((matches = moveObj.autoguiMove.match(/^L_([0-9]+)_([0-9]+)*/))) {
          lines.push({p1: parseInt(matches[1]), p2: parseInt(matches[2]), move});
        } else if ((matches = moveObj.autoguiMove.match(/^T_([a-zA-Z0-9-])_([0-9]+)*/))) {
          textButtons.push({text: matches[1], center: parseInt(matches[2]), move});
        } else if ((matches = moveObj.autoguiMove.match(/^MQ_([ACR]{3})/))) {
          const parsedData = [...moveObj.autoguiMove.matchAll(/_(-?\d+(\.\d+)?)/g)].map(match => parseFloat(match[1]));
          console.log(parsedData);
          const points: Point[] = parseAbsolutePoints(matches[1], parsedData);
          quadraticBeziers.push({start: points[0], control: points[1], end: points[2], move: move});
          if (points.length != 3) {
            console.error("[IAGQuadraticBezierButton] Unexpected number of points:", points);
          }
        } else if ((matches = moveObj.autoguiMove.match(/^MC_([ACR]{4})/))) {
          const parsedData = [...moveObj.autoguiMove.matchAll(/_(-?\d+(\.\d+)?)/g)].map(match => parseFloat(match[1]));
          console.log(parsedData);
          const points: Point[] = parseAbsolutePoints(matches[1], parsedData);
          if (points.length != 4) {
            console.error("[IAGCubicBezierButton] Unexpected number of points:", points);
          }
          cubicBeziers.push({start: points[0], control1: points[1], control2: points[2], end: points[3], move: move});
        } else if ((matches = moveObj.autoguiMove.match(/^MA_([ACRX]{7})/))) {
          const parsedData = [...moveObj.autoguiMove.matchAll(/_(-?\d+(\.\d+)?)/g)].map(match => parseFloat(match[1]));
          console.log(parsedData);
          const points: Point[] = parseAbsolutePoints(matches[1], parsedData);
          if (points.length != 7) {
            console.error("[IAGEllipticalArcButton] Unexpected number of points:", points);
          }
          // Non-positioning parameter values are accessed through the x-component of the point, hence the use of points[i].x.
          ellipticalArcs.push({start: points[0], radiiX: points[1].x, radiiY: points[2].x, rotation: points[3].x, largeArcFlag: points[4].x, clockwiseSweepFlag: points[5].x, end: points[6], move: move});
        } else {
          listedButtons.push(moveObj);
        }
      }

      const computeSquaredLength = (ax: number, ay: number, bx: number, by: number): number => {
        return Math.pow(ax - bx, 2) + Math.pow(ay - by, 2);
      };

      const compareArrowSquaredLength = 
          (a: IAGArrowButton, b: IAGArrowButton): number => {
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
        textEntities,
        textButtons,
        quadraticBeziers,
        cubicBeziers,
        ellipticalArcs,
        listedButtons,
        isValidAutoguiPositionString,
      };
    }

    return {
      isValidAutoguiPositionString
    }
  });

  const listedMoves = computed(() => autoguiPositionData.value.isValidAutoguiPositionString ? autoguiPositionData.value.listedButtons : Object.values(currentAvailableMoves.value));

  /* An arrow move button is a concave heptagon (see below) except with a curve from point 6 to point 0.
  All arrowheads must be 55-55-70 triangles. Given the arrow's endpoint and thickness (and other parameters
  `startOffset` and `endOffset`), return the vertex coordinates of the arrow move button as a string. 
             2
             | \
  0----------1  \
  |              3
  6----------4  /
             | /
             5
  */
  const formatArrowPathPoints = 
      (arrow: IAGArrowButton,
      thickness: number = 0.75,
      startOffset: number = 3,
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
    const arrowheadHeight = 4.284444 * thickNorm; // = 3tan(55 degrees) * thickNorm
    const midCoords = [coords3[0] - dir[0] * arrowheadHeight, coords3[1] - dir[1] * arrowheadHeight];
    const coords0 = [fromCoords[0] - perpdir[0] * thickNorm, fromCoords[1] - perpdir[1] * thickNorm];
    const coords6 = [fromCoords[0] + perpdir[0] * thickNorm, fromCoords[1] + perpdir[1] * thickNorm];
    const coords1 = [midCoords[0] - perpdir[0] * thickNorm, midCoords[1] - perpdir[1] * thickNorm];
    const coords2 = [midCoords[0] - 3 * perpdir[0] * thickNorm, midCoords[1] - 3 * perpdir[1] * thickNorm];
    const coords5 = [midCoords[0] + perpdir[0] * thickNorm, midCoords[1] + perpdir[1] * thickNorm];
    const coords4 = [midCoords[0] + 3 * perpdir[0] * thickNorm, midCoords[1] + 3 * perpdir[1] * thickNorm];

    return `M${coords0[0]},${coords0[1]}L${coords1[0]},${coords1[1]}L${coords2[0]},${coords2[1]}
            L${coords3[0]},${coords3[1]}L${coords4[0]},${coords4[1]}L${coords5[0]},${coords5[1]}
            L${coords6[0]},${coords6[1]}A ${thickness} ${thickness} 0 0 0 ${coords0[0]} ${coords0[1]}Z`;
  };

  const moveButtonTitle = (moveStr: string): string => {
    var moveObj = currentAvailableMoves.value[moveStr];
    var value = moveObj.moveValue[0].toUpperCase() + moveObj.moveValue.substring(1);
    return options.value.showNextMoveHints ? (value + (value === "Draw" || value === "Unsolved" || moveObj.remoteness < 0 ? ""
     : (" in " + moveObj.remoteness + (!moveObj.winby ? "" : " or by " + moveObj.winby)))) : "";
  }

  const getBoardMoveElementHintClass = (move?: IAGMove): string => 
      (move && options.value.showNextMoveHints ? "hint-" + move.hint : "");  
</script>

<style lang="scss" scoped>

  #image-autogui {
    height: 100%;
    width: 100%;
  }

  #position-string {
    border: 0.1rem solid var(--neutralColor);
    border-radius: 1rem;
    > h3 {
      margin: 1rem;
    }
    > pre {
        display: inline-block;
        padding-bottom: 1rem;
    }
  }

  #listed-moves {
    border: 0.1rem solid var(--neutralColor);
    border-radius: 1rem;
    padding: 1rem;
    > h3 {
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
            &:hover {
              cursor: pointer;
            }
        }
    }
  }

  @keyframes pulsing-point {
    0% { transform: scale(1); }
    100% { transform: scale(1.2); }
  }

  @keyframes pulsing-arrow {
    0% { stroke-width: 1; }
    100% { stroke-width: 1.5; }
  }

  @keyframes pulsing-line {
    0% { stroke-width: var(--w); }
    100% { stroke-width: var(--w2); }
  }

  text {
    text-anchor: middle;
    alignment-baseline: middle;
    font-family: Arial, Helvetica, sans-serif;
  }

  .iag-button-point {
    transform-origin: var(--tOrigin);
    
    [data-turn="1"] &.move { fill: var(--turn1Color); stroke: var(--turn1Color); }
    [data-turn="2"] &.move { fill: var(--turn2Color); stroke: var(--turn1Color); }

    &.move.hint- {
      &win      { fill: var(--winColor); stroke: var(--winColor); }
      &draw     { fill: var(--drawColor); stroke: var(--drawColor); }
      &tie      { fill: var(--tieColor); stroke: var(--tieColor); }
      &lose     { fill: var(--loseColor); stroke: var(--loseColor); }
      &unsolved { fill: var(--unsolvedColor); stroke: var(--unsolvedColor); }
    }

    &:hover {
      cursor: pointer;
      animation-name: pulsing-point;
      animation-duration: 0.3s;
      animation-iteration-count: infinite;
      animation-timing-function: ease-in-out;
      animation-direction: alternate;
    }
  }

  .iag-button-arrow {
    stroke: var(--primaryColor);
    fill: var(--primaryColor);

    [data-turn="1"] & {
      stroke: var(--turn1Color);
      fill: var(--turn1Color);
    }
    [data-turn="2"] & {
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
      cursor: pointer;
      animation-name: pulsing-arrow;
      animation-duration: 0.3s;
      animation-iteration-count: infinite;
      animation-timing-function: ease-in-out;
      animation-direction: alternate;
    }
  }

  .iag-button-line, .iag-button-quadraticbezier, .iag-button-cubicbezier, .iag-button-ellipticalarc {
    stroke: var(--primaryColor);

    [data-turn="1"] & { stroke: var(--turn1Color); }
    [data-turn="2"] & { stroke: var(--turn2Color); }

    &.hint- {
      &win { stroke: var(--winColor); }
      &draw { stroke: var(--drawColor); }
      &tie { stroke: var(--tieColor); }
      &lose { stroke: var(--loseColor); }
      &unsolved { stroke: var(--unsolvedColor); }
    }

    &:hover {
      cursor: pointer;
      animation-name: pulsing-line;
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