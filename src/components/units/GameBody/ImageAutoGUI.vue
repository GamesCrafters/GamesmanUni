<template>
  <!-- Render position only if the autogui position string is valid. -->
  <svg v-if="autoguiPositionData.isValidAutoguiPositionString"
    id="image-autogui" xmlns="http://www.w3.org/2000/svg"
    :viewBox="'-2 -2 ' + (scaledWidth + 4) + ' ' + (scaledHeight + 4)" 
    :data-turn="autoguiPositionData.turn">

    <!-- Draw Background Image -->
    <image v-if="currentBackgroundPath" x="0" y="0"
      :width="scaledWidth" :height="scaledHeight"
      :href="getImageSource(currentBackgroundPath)"/>

    <!-- Draw M-type (arrow) move buttons below entities -->
    <template v-if="!animationPlaying && entitiesOverArrows"> 
      <path v-for="(arrow, i) in autoguiPositionData.arrows" :key="'arrow' + i"
        :d="formatArrowPathPoints(arrow, arrowWidth)"
        :class="['iag-button-arrow ' + getBoardMoveElementHintClass(arrow.move), (options.highlightMove && highlightedMove === arrow.move.str) ? 'highlighted' : '']"
        :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? arrow.move.hintOpacity : 1"
        @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: arrow.move.str })"
        @mouseover="store.commit(mutationTypes.setHighlightedMove, arrow.move.str)"
        @mouseout="store.commit(mutationTypes.setHighlightedMove, '')">
        <title>{{ moveButtonTitle(arrow.move.str) }}</title>
      </path>
    </template>

    <!-- Draw Regular (Image) Entities -->
    <g v-for="(entity, i) in autoguiPositionData.board" :key="'entity' + i">
      <image class="entity" v-if="centers[i] && entity != '-' && entity in charImages"
        :id="'entity' + i"
        :x="centers[i][0] - 0.5 * charImages[entity].scale * widthFactor * entityScaleBoost"
        :y="centers[i][1] - 0.5 * charImages[entity].scale * widthFactor * entityScaleBoost"
        :width="charImages[entity].scale * widthFactor * entityScaleBoost"
        :height="charImages[entity].scale * widthFactor * entityScaleBoost"
        :href="getImageSource(charImages[entity].image)"/>
    </g>

    <!-- Marble Circuit pull arrow (right side of the long bar). Reveal player1fail after click. -->
    <g
      v-if="isMarbleCircuitTheme && !marblePullActivated"
      id="marble-pull-lever"
      style="cursor: pointer;"
      @click="marblePullActivated = true"
    >
      <!-- simple small arrow: line + triangle head -->
      <path
        :d="`M ${marblePullArrowX - 7} ${marblePullArrowY} L ${marblePullArrowX + 4} ${marblePullArrowY}`"
        stroke="#111"
        stroke-width="1.1"
        stroke-linecap="round"
      />
      <path
        :d="`M ${marblePullArrowX + 4} ${marblePullArrowY - 2.8} L ${marblePullArrowX + 9} ${marblePullArrowY} L ${marblePullArrowX + 4} ${marblePullArrowY + 2.8} Z`"
        fill="#111"
      />
    </g>

    <!-- Marble Circuit hover hitboxes (slot picking) -->
    <g v-if="isMarbleCircuitTheme" id="marble-hover-hitboxes">
      <circle
        v-for="(c, i) in centers"
        :key="'hover-slot-' + i"
        :cx="c[0]"
        :cy="c[1]"
        :r="hoverHitRadius"
        fill="transparent"
        style="pointer-events: all;"
        @mouseenter="cancelHoverClear(); hoveredSlotIndex = i"
        @mouseleave="scheduleHoverClear()"
      />
    </g>

    <!-- Static goal labels (e.g. Marble Circuit exit_counts in bottom triangles) -->
    <g v-for="(gv, gi) in goalExitOverlay" :key="'goal-exit-' + gi">
      <text
        class="iag-goal-exit"
        :x="gv.x"
        :y="gv.y"
        :style="'font-size:' + gv.fontSize + 'px; fill:#ffffff'">
        {{ gv.text }}
      </text>

      <text
        v-if="marbleExitCompare && marbleExitCompare[gi]"
        class="iag-goal-exit-current"
        :x="gv.x + marbleExitCurrentDx"
        :y="gv.y"
        :style="'font-size:' + (gv.fontSize * 0.65) + 'px; fill:' + (marbleExitCompare[gi].mismatch ? '#ff3333' : '#ffffff')">
        {{ marbleExitCompare[gi].cur }}
      </text>
    </g>

    <!-- Marble Circuit remaining pieces legend (top-left) -->
    <g v-if="marbleLegendItems.length" id="marble-legend">
      <g v-for="(item, idx) in marbleLegendItems" :key="'legend-' + item.tokenChar">
        <image
          :href="getImageSource(item.image)"
          :x="2"
          :y="2 + idx * 8"
          :width="5"
          :height="5"
        />
        <text class="iag-goal-exit"
          :x="10"
          :y="2 + idx * 8 + 2.5"
          :style="'font-size:' + marbleGoalFontSizePx + 'px; fill:#000000; stroke:#ffffff; stroke-width:0.06em'">
          {{ item.count }}
        </text>
      </g>
    </g>

    <!-- Draw Text Entities -->
    <text v-for="(value, i) of autoguiPositionData.textEntities" :key="'entity' + i"
      class="entity"
      :id="'entity' + i"
      :x="centers[i][0]"
      :y="centers[i][1]" 
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
              :x="centers[token.center][0] - 0.5 * charImages[token.token].scale * widthFactor * entityScaleBoost"
              :y="centers[token.center][1] - 0.5 * charImages[token.token].scale * widthFactor * entityScaleBoost"
              :width="charImages[token.token].scale * widthFactor * entityScaleBoost" 
              :height="charImages[token.token].scale * widthFactor * entityScaleBoost"
              :class="['iag-button-point ' + (token.move ? 'move ' : '') + getBoardMoveElementHintClass(token.move), (options.highlightMove && highlightedMove === token.move.str) ? 'highlighted' : '']"
              :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? token.move.hintOpacity : 1"
              :style="'--tOrigin: ' + centers[token.center][0] + 'px ' + centers[token.center][1] + 'px'"
              :href="getImageSource(charImages[token.token].image) + '#MoveButtonSVG'"
              @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: token.move.str })"
              @mouseover="store.commit(mutationTypes.setHighlightedMove, token.move.str)"
              @mouseout="store.commit(mutationTypes.setHighlightedMove, '')">
              <title>{{ moveButtonTitle(token.move.str) }}</title>
            </use>
          </g>

          <!-- If no move token specified, use default move button (a circle). -->
          <circle v-else
            :cx="centers[token.center][0]" :cy="centers[token.center][1]"
            :stroke-width="0" :r="defaultMoveTokenRadius"
            :class="['iag-button-point ' + (token.move ? 'move ' : '') + getBoardMoveElementHintClass(token.move), (options.highlightMove && highlightedMove === token.move.str) ? 'highlighted' : '']"
            :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? token.move.hintOpacity : 1"
            :style="'--tOrigin: ' + centers[token.center][0] + 'px ' + centers[token.center][1] + 'px;'"
            @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: token.move.str })"
            @mouseover="store.commit(mutationTypes.setHighlightedMove, token.move.str)"
            @mouseout="store.commit(mutationTypes.setHighlightedMove, '')">
            <title>{{ moveButtonTitle(token.move.str) }}</title>
          </circle>
        </g>
      </g>

      <!-- Draw T-type (text) move buttons -->
      <text v-for="textButton in autoguiPositionData.textButtons" :key="textButton.move.str"
        :x="centers[textButton.center][0]" :y="centers[textButton.center][1]"
        :class="['iag-button-point ' + (textButton.move ? 'move ' : '') + getBoardMoveElementHintClass(textButton.move), (options.highlightMove && highlightedMove === textButton.move.str) ? 'highlighted' : '']"
        :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? textButton.move.hintOpacity : 1"
        :style="'font-size:' + textButtonFontSize + 'px;stroke:none;--tOrigin: ' + centers[textButton.center][0] + 'px ' + centers[textButton.center][1] + 'px'"
        @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: textButton.move.str })"
        @mouseover="store.commit(mutationTypes.setHighlightedMove, textButton.move.str)"
        @mouseout="store.commit(mutationTypes.setHighlightedMove, '')">
        {{ textButton.text }}
        <title>{{ moveButtonTitle(textButton.move.str) }}</title>
      </text>

      <!-- Draw M-type (arrow) move buttons on top of entities -->
      <template v-if="!entitiesOverArrows"> 
        <path v-for="arrow in autoguiPositionData.arrows " :key="arrow.move.str"
          :d="formatArrowPathPoints(arrow, arrowWidth)"
          :class="['iag-button-arrow ' + getBoardMoveElementHintClass(arrow.move), (options.highlightMove && highlightedMove === arrow.move.str) ? 'highlighted' : '']"
          :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? arrow.move.hintOpacity : 1"
          @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: arrow.move.str })"
          @mouseover="store.commit(mutationTypes.setHighlightedMove, arrow.move.str)"
          @mouseout="store.commit(mutationTypes.setHighlightedMove, '')">
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
        :class="['iag-button-line ' + getBoardMoveElementHintClass(line.move), (options.highlightMove && highlightedMove === line.move.str) ? 'highlighted' : '']"
        :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? line.move.hintOpacity : 1"
        @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: line.move.str })"
        @mouseover="store.commit(mutationTypes.setHighlightedMove, line.move.str)"
        @mouseout="store.commit(mutationTypes.setHighlightedMove, '')">
        <title>{{ moveButtonTitle(line.move.str) }}</title>
      </line>

      <!-- Draw LQ-subtype (quadratic bezier) move buttons. -->
      <path 
        v-for="quadraticBezier in autoguiPositionData.quadraticBeziers" 
        fill="none"
        :d="`M ${quadraticBezier.start.x} ${quadraticBezier.start.y} Q ${quadraticBezier.control.x} ${quadraticBezier.control.y} ${quadraticBezier.end.x} ${quadraticBezier.end.y}`" 
        :stroke-linecap="'round'"
        :style="'--w: ' + lineWidth + ';--w2: ' + (lineWidth * 1.75) + ';'"
        :stroke-width=lineWidth
        :class="['iag-button-quadraticbezier ' + getBoardMoveElementHintClass(quadraticBezier.move), (options.highlightMove && highlightedMove === quadraticBezier.move.str) ? 'highlighted' : '']"
        :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? quadraticBezier.move.hintOpacity : 1"
        @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: quadraticBezier.move.str })"
        :key="quadraticBezier.move.str"
        @mouseover="store.commit(mutationTypes.setHighlightedMove, quadraticBezier.move.str)"
        @mouseout="store.commit(mutationTypes.setHighlightedMove, '')"
      />

      <!-- Draw LC-subtype (cubic bezier) move buttons. -->
      <path 
        v-for="cubicBezier in autoguiPositionData.cubicBeziers" 
        fill="none"
        :d="`M ${cubicBezier.start.x} ${cubicBezier.start.y} C ${cubicBezier.control1.x} ${cubicBezier.control1.y} ${cubicBezier.control2.x} ${cubicBezier.control2.y} ${cubicBezier.end.x} ${cubicBezier.end.y}`" 
        :stroke-linecap="'round'"
        :style="'--w: ' + lineWidth + ';--w2: ' + (lineWidth * 1.75) + ';'"
        :stroke-width=lineWidth
        :class="['iag-button-cubicbezier ' + getBoardMoveElementHintClass(cubicBezier.move), (options.highlightMove && highlightedMove === cubicBezier.move.str) ? 'highlighted' : '']"
        :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? cubicBezier.move.hintOpacity : 1"
        @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: cubicBezier.move.str })"
        :key="cubicBezier.move.str"
        @mouseover="store.commit(mutationTypes.setHighlightedMove, cubicBezier.move.str)"
        @mouseout="store.commit(mutationTypes.setHighlightedMove, '')"
      />

      <!-- Draw LA-subtype (elliptical arc) move buttons. -->
      <path 
        v-for="ellipticalArc in autoguiPositionData.ellipticalArcs"
        fill="none"
        :d="`M ${ellipticalArc.start.x} ${ellipticalArc.start.y} A ${ellipticalArc.radiiX} ${ellipticalArc.radiiY} ${ellipticalArc.rotation} ${ellipticalArc.largeArcFlag} ${ellipticalArc.clockwiseSweepFlag} ${ellipticalArc.end.x} ${ellipticalArc.end.y}`" 
        :stroke-linecap="'round'"
        :style="'--w: ' + lineWidth + ';--w2: ' + (lineWidth * 1.75) + ';'"
        :stroke-width=lineWidth
        :class="['iag-button-ellipticalarc ' + getBoardMoveElementHintClass(ellipticalArc.move), (options.highlightMove && highlightedMove === ellipticalArc.move.str) ? 'highlighted' : '']"
        :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? ellipticalArc.move.hintOpacity : 1"
        @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: ellipticalArc.move.str })"
        :key="ellipticalArc.move.str"
        @mouseover="store.commit(mutationTypes.setHighlightedMove, ellipticalArc.move.str)"
        @mouseout="store.commit(mutationTypes.setHighlightedMove, '')"
      />
    </template>

    <!-- Marble Circuit hover placement/removal overlay -->
    <g
      v-if="isMarbleCircuitTheme && hoveredSlotIndex !== null && marbleHoverOverlayVisible"
      id="marble-hover-panel"
      @mouseenter="cancelHoverClear()"
      @mouseleave="scheduleHoverClear()"
    >
      <rect
        :x="marbleHoverPanelX"
        :y="marbleHoverPanelY"
        :width="52"
        :height="26"
        rx="1"
        class="iag-hover-panel-bg"
      />

      <g v-for="(tokenChar, idx) in marbleTokenOrder" :key="'hover-place-' + tokenChar">
        <image
          v-if="marbleHoverPlacementMoveByToken[tokenChar] && charImages[tokenChar]"
          :href="getImageSource(charImages[tokenChar].image)"
          :x="marbleHoverPanelX + 3 + idx * 12"
          :y="marbleHoverPanelY + 6"
          :width="9"
          :height="9"
          class="marble-hover-piece-btn"
          @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: marbleHoverPlacementMoveByToken[tokenChar]! })"
          @mouseover="store.commit(mutationTypes.setHighlightedMove, marbleHoverPlacementMoveByToken[tokenChar]!)"
          @mouseout="store.commit(mutationTypes.setHighlightedMove, '')"
        />
      </g>

      <g v-if="marbleHoverRemoveMove">
        <circle
          :cx="marbleHoverPanelX + 26.0"
          :cy="marbleHoverPanelY + 20.0"
          r="5.8"
          class="marble-hover-remove-bg"
        />
        <image
          v-if="marbleHoverOccupiedTokenChar && marbleHoverOccupiedTokenChar in charImages"
          :href="getImageSource(charImages[marbleHoverOccupiedTokenChar].image)"
          :x="marbleHoverPanelX + 26.0 - 4.5"
          :y="marbleHoverPanelY + 15.5"
          :width="9"
          :height="9"
        />
        <text
          :x="marbleHoverPanelX + 26.0"
          :y="marbleHoverPanelY + 20.0"
          class="marble-hover-remove-x"
          @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: marbleHoverRemoveMove! })"
          @mouseover="store.commit(mutationTypes.setHighlightedMove, marbleHoverRemoveMove!)"
          @mouseout="store.commit(mutationTypes.setHighlightedMove, '')"
        >
          ×
        </text>
      </g>
    </g>
  </svg>
  <div id="position-string" v-else>
    <!-- If cannot render position as image, display the position string instead. -->
    <h3>Current Position</h3>
    <pre>{{ currentPosition }}</pre>
  </div>
  <div id="listed-moves" v-if="options.showNextMoves && displayedListedMoves.length">
    <!-- List all moves that do not have a proper AutoGUI move button. -->
    <h3>{{ autoguiPositionData.isValidAutoguiPositionString ? 'Other' : ''}} Available Moves</h3>
    <div id="moves">
      <div class="move" v-for="listedMove in displayedListedMoves" :key="listedMove.autoguiMove"
        :class="[options.showNextMoveHints ? `uni-${listedMove.moveValue}` : '', (options.highlightMove && highlightedMove === listedMove.autoguiMove) ? 'highlighted' : '']"
        :style="{ opacity: options.showNextMoveDeltaRemotenesses ? listedMove.moveValueOpacity : 1 }"
        @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: listedMove.autoguiMove })"
        @mouseover="store.commit(mutationTypes.setHighlightedMove, listedMove.autoguiMove)"
        @mouseout="store.commit(mutationTypes.setHighlightedMove, '')">{{ listedMove.move }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from "vue";
  import { actionTypes, mutationTypes, useStore } from "../../../scripts/plugins/store";
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
  /** Extra scale for piece images (theme.entityScaleBoost), e.g. Marble Circuit. */
  const entityScaleBoost = computed(() => theme.value.entityScaleBoost ?? 1);
  const charImages = computed(() => theme.value.charImages);
  const centers = computed(() => theme.value.centers.map((a: Array<number>) => a.map((b: number) => b * widthFactor.value)));
  const arrowWidth = computed(() => (theme.value.arrowWidth * widthFactor.value / 2) || 1.5);
  const lineWidth = computed(() => theme.value.lineWidth || 0.04);
  const defaultMoveTokenRadius = computed(() => (theme.value.circleButtonRadius * widthFactor.value) || 2);
  const entitiesOverArrows = computed(() => theme.value.entitiesOverArrows || false);
  const textEntityFontSize = computed(() => theme.value.textEntityFontSize * widthFactor.value || 10);
  const textButtonFontSize = computed(() => theme.value.textButtonFontSize * widthFactor.value || 10);

  const goalExitOverlay = computed(() => {
    const gc = theme.value.goalExitCenters;
    const gv = theme.value.goalExitValues;
    const wf = widthFactor.value;
    const fsBase = theme.value.goalExitFontSize ?? 22;
    if (!gc || !gv || gc.length !== gv.length) return [] as { x: number; y: number; fontSize: number; text: string }[];
    return gv.map((text: string, i: number) => ({
      x: gc[i][0] * wf,
      y: gc[i][1] * wf,
      fontSize: fsBase * wf,
      text,
    }));
  });

  // Marble Circuit: hover-slot placement/removal overlay + remaining-pieces legend
  const isMarbleCircuitTheme = computed(() => !!(theme.value.goalExitCenters && theme.value.goalExitValues));
  const hoveredSlotIndex = ref<number | null>(null);
  const hoverHitRadius = 6;
  const marblePullActivated = computed({
    get: () => store.getters.marblePullActivated ?? false,
    set: (val: boolean) => {
      store.commit(mutationTypes.setMarblePullActivated, val);
    },
  });
  const currentBackgroundPath = computed(() => {
    if (!isMarbleCircuitTheme.value) return theme.value.background;

    const bg = theme.value.background;
    const bgNoBalls = theme.value.backgroundNoBalls;

    const looksNoBalls = typeof bg === "string" && bg.includes("noballs.svg");

    // If theme background was loaded from an old UWAPI (still noballs), override it
    // so that restart (lever off) shows the normal Board.svg.
    if (!marblePullActivated.value && looksNoBalls) {
      return "marble_circuit/Board.svg";
    }

    if (marblePullActivated.value && bgNoBalls) {
      return bgNoBalls;
    }
    return bg;
  });
  // Position (in theme 960-space) is tuned for Marble Circuit long bar right end.
  const marblePullArrowX = computed(() => 843 * widthFactor.value);
  const marblePullArrowY = computed(() => 187 * widthFactor.value);

  // marblePullActivated is driven by Vuex; restartMatch updates will be reflected immediately.

  const hoverClearTimer = ref<number | null>(null);
  const cancelHoverClear = () => {
    if (hoverClearTimer.value != null) {
      window.clearTimeout(hoverClearTimer.value);
      hoverClearTimer.value = null;
    }
  };
  const scheduleHoverClear = () => {
    cancelHoverClear();
    hoverClearTimer.value = window.setTimeout(() => {
      hoveredSlotIndex.value = null;
      hoverClearTimer.value = null;
    }, 160);
  };

  const marbleRemCounts = computed(() => {
    if (!isMarbleCircuitTheme.value) return null;
    const pos = currentAutoguiPosition.value;
    if (!pos) return null;
    const matches = pos.match(/^(0|1|2)_(.*)$/);
    if (!matches) return null;
    const rest = matches[2];
    const parts = rest.split("_");
    const slotCount = theme.value.centers.length;
    // Marble format: <board>_<r0>_<r1>_<r2>_<r3>_<confirmed>
    if (parts.length < 6 || parts[0].length !== slotCount) return null;
    const nums = [parts[1], parts[2], parts[3], parts[4]].map((p) => parseInt(p, 10));
    if (nums.some((n) => Number.isNaN(n))) return null;
    return { "1": nums[0], "2": nums[1], "3": nums[2], "4": nums[3] } as Record<string, number>;
  });

  const marbleConfirmed = computed(() => {
    if (!isMarbleCircuitTheme.value) return false;
    const pos = currentAutoguiPosition.value;
    if (!pos) return false;
    const matches = pos.match(/^(0|1|2)_(.*)$/);
    if (!matches) return false;
    const rest = matches[2];
    const parts = rest.split("_");
    const slotCount = theme.value.centers.length;
    if (parts.length < 6 || parts[0].length !== slotCount) return false;
    const confirmed = parseInt(parts[5], 10);
    if (Number.isNaN(confirmed)) return false;
    return confirmed === 1;
  });

  const marbleBoardDigits = computed(() => {
    if (!isMarbleCircuitTheme.value) return null as number[] | null;
    const pos = currentAutoguiPosition.value;
    if (!pos) return null;
    const matches = pos.match(/^(0|1|2)_(.*)$/);
    if (!matches) return null;
    const rest = matches[2];
    const parts = rest.split("_");
    const slotCount = theme.value.centers.length;
    if (parts.length < 6 || parts[0].length !== slotCount) return null;
    const boardStr = parts[0];
    const digits = boardStr.split("").map((c) => parseInt(c, 10));
    if (digits.some((n) => Number.isNaN(n))) return null;
    return digits;
  });

  // Marble Circuit exit-count simulation (ch23/ch46 share the same layout/topology).
  const marbleExitCounts = computed(() => {
    if (!isMarbleCircuitTheme.value) return null as number[] | null;
    const board = marbleBoardDigits.value;
    if (!board || board.length !== 10) return null;

    const TOP_LEFT = 0, TOP_RIGHT = 1, BOTTOM_RIGHT = 2, BOTTOM_LEFT = 3;
    const TOP = 0, RIGHT = 1, BOTTOM = 2, LEFT = 3;

    const TEAL_DIAMOND_PATHS: Array<[number, number]> = [
      [TOP_LEFT, BOTTOM_LEFT],
      [BOTTOM_LEFT, TOP_LEFT],
      [TOP_RIGHT, BOTTOM_RIGHT],
      [BOTTOM_RIGHT, TOP_RIGHT],
    ];
    const ORANGE_T_PATHS: Array<[number, number]> = [
      [TOP_LEFT, BOTTOM_RIGHT],
      [BOTTOM_RIGHT, TOP_LEFT],
      [TOP_RIGHT, BOTTOM_RIGHT],
      [BOTTOM_RIGHT, TOP_RIGHT],
    ];
    const YELLOW_T_PATHS: Array<[number, number]> = [
      [TOP_LEFT, BOTTOM_LEFT],
      [BOTTOM_LEFT, TOP_LEFT],
      [TOP_RIGHT, BOTTOM_LEFT],
      [BOTTOM_LEFT, TOP_RIGHT],
    ];
    const MAGENTA_4WAY_PATHS: Array<[number, number]> = [
      [TOP_LEFT, BOTTOM_RIGHT],
      [BOTTOM_RIGHT, TOP_LEFT],
      [TOP_RIGHT, BOTTOM_LEFT],
      [BOTTOM_LEFT, TOP_RIGHT],
    ];

    const getBlockPaths = (cell: number) => {
      if (cell === 0) return [] as Array<[number, number]>;
      if (cell === 1) return TEAL_DIAMOND_PATHS;
      if (cell === 2) return ORANGE_T_PATHS;
      if (cell === 3) return YELLOW_T_PATHS;
      if (cell === 4) return MAGENTA_4WAY_PATHS;
      return [] as Array<[number, number]>;
    };

    type Conn = [number, number] | ["exit", number] | null;
    const PYRAMID_10_TOPOLOGY_CORNERS: Conn[][] = [
      [null, null, [2, TOP_LEFT], [1, TOP_RIGHT]],
      [[0, BOTTOM_LEFT], [0, BOTTOM_RIGHT], [4, TOP_LEFT], [3, TOP_RIGHT]],
      [[1, BOTTOM_RIGHT], [5, TOP_LEFT], [5, TOP_LEFT], [4, TOP_RIGHT]],
      [[1, BOTTOM_LEFT], [1, BOTTOM_RIGHT], [7, TOP_LEFT], [6, TOP_RIGHT]],
      [[1, BOTTOM_RIGHT], [2, BOTTOM_LEFT], [8, TOP_LEFT], [7, TOP_RIGHT]],
      [[2, BOTTOM_RIGHT], [2, BOTTOM_LEFT], [9, TOP_LEFT], [8, TOP_RIGHT]],
      [[3, BOTTOM_LEFT], [3, BOTTOM_LEFT], ["exit", 1], ["exit", 0]],
      [[3, BOTTOM_RIGHT], [4, BOTTOM_LEFT], ["exit", 2], ["exit", 1]],
      [[4, BOTTOM_RIGHT], [5, BOTTOM_LEFT], ["exit", 3], ["exit", 2]],
      [[5, BOTTOM_RIGHT], null, ["exit", 4], ["exit", 3]],
    ];

    const ENTRY_START_PYRAMID: Array<[number, number]> = [
      [6, TOP_LEFT],
      [3, TOP_LEFT],
      [1, TOP_LEFT],
      [0, TOP_LEFT],
      [0, TOP_RIGHT],
      [2, TOP_RIGHT],
      [5, TOP_RIGHT],
      [9, TOP_RIGHT],
    ];

    const simulateMarble = (startEntry: number): number | null => {
      let [slot, side] = ENTRY_START_PYRAMID[startEntry];
      const visited = new Set<string>();
      while (true) {
        const k = `${slot},${side}`;
        if (visited.has(k)) return null;
        visited.add(k);

        const cell = board[slot];
        const paths = getBlockPaths(cell);
        let out_side: number | null = null;
        for (const [a, b] of paths) {
          if (a === side) {
            out_side = b;
            break;
          }
        }
        if (out_side === null) return null;
        const conn = PYRAMID_10_TOPOLOGY_CORNERS[slot][out_side] as Conn;
        if (!conn) return null;
        if (conn[0] === "exit") return conn[1];
        slot = conn[0];
        side = conn[1];
      }
    };

    const counts = [0, 0, 0, 0, 0];
    for (let entryId = 0; entryId < 8; entryId++) {
      const ex = simulateMarble(entryId);
      if (ex !== null && ex >= 0 && ex <= 4) counts[ex] += 1;
    }
    return counts;
  });

  const marbleExitCompare = computed(() => {
    if (!isMarbleCircuitTheme.value) return null as null | Array<{ goal: number; cur: number; mismatch: boolean }>;
    if (!marblePullActivated.value) return null as null | Array<{ goal: number; cur: number; mismatch: boolean }>;
    const cur = marbleExitCounts.value;
    const goalStrs = theme.value.goalExitValues;
    if (!cur || !goalStrs || cur.length !== 5 || goalStrs.length !== 5) return null;
    const goals = goalStrs.map((s: string) => parseInt(s, 10));
    if (goals.some((n) => Number.isNaN(n))) return null;
    return cur.map((curVal, i) => ({ goal: goals[i], cur: curVal, mismatch: curVal !== goals[i] }));
  });

  const marbleExitCurrentDx = computed(() => 10 * widthFactor.value);

  const marbleLegendItems = computed(() => {
    const rem = marbleRemCounts.value;
    if (!rem) return [] as Array<{ tokenChar: string; image: string; count: number }>;
    const order = ["1", "2", "3", "4"] as const;
    const imgs = charImages.value;
    return order.map((tokenChar: string) => {
      const ci = imgs?.[tokenChar];
      return ci ? { tokenChar, image: ci.image, count: rem[tokenChar] ?? 0 } : { tokenChar, image: "", count: rem[tokenChar] ?? 0 };
    }).filter((it) => it.image);
  });

  const marbleGoalFontSizePx = computed(() => (theme.value.goalExitFontSize ?? 22) * widthFactor.value);

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
    // Puzzles may use 0_; two-player games use 1_/2_. Be permissive after the prefix.
    const matches = currentAutoguiPosition.value.match(/^(0|1|2)_(.*)$/)!;
    const isValidAutoguiPositionString = matches && matches.length >= 3 && imageAutoGUIData.value != null;
    if (isValidAutoguiPositionString) {
      const turn = matches[1];
      const rest = matches[2];
      const slotCount = theme.value.centers.length;
      let entityStringParts: string[];
      let board: string;
      if (rest.includes("~")) {
        entityStringParts = rest.split("~");
        board = entityStringParts[0];
      } else {
        const under = rest.split("_");
        if (under.length >= 2 && under[0].length === slotCount) {
          board = under[0];
          entityStringParts = [board];
        } else {
          entityStringParts = rest.split("~");
          board = entityStringParts[0];
        }
      }
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
        } else if ((matches = moveObj.autoguiMove.match(/^M_([0-9]+)_([0-9]+)(?:_|$)/))) {
          /* Require two numeric endpoints; avoids matching Marble Circuit M_<slot>_<T|O|Y|M>_x as an arrow. */
          arrows.push({from: parseInt(matches[1], 10), to: parseInt(matches[2], 10), move});
        } else if ((matches = moveObj.autoguiMove.match(/^L_([0-9]+)_([0-9]+)*/))) {
          lines.push({p1: parseInt(matches[1]), p2: parseInt(matches[2]), move});
        } else if ((matches = moveObj.autoguiMove.match(/^T_([a-zA-Z0-9-])_([0-9]+)*/))) {
          textButtons.push({text: matches[1], center: parseInt(matches[2]), move});
        } else if ((matches = moveObj.autoguiMove.match(/^LQ_([ACR]{3})/))) {
          const parsedData = [...moveObj.autoguiMove.matchAll(/_(-?\d+(\.\d+)?)/g)].map(match => parseFloat(match[1]));
          const points: Point[] = parseAbsolutePoints(matches[1], parsedData);
          quadraticBeziers.push({start: points[0], control: points[1], end: points[2], move: move});
          if (points.length != 3) {
            console.error("[IAGQuadraticBezierButton] Unexpected number of points:", points);
          }
        } else if ((matches = moveObj.autoguiMove.match(/^LC_([ACR]{4})/))) {
          const parsedData = [...moveObj.autoguiMove.matchAll(/_(-?\d+(\.\d+)?)/g)].map(match => parseFloat(match[1]));
          const points: Point[] = parseAbsolutePoints(matches[1], parsedData);
          if (points.length != 4) {
            console.error("[IAGCubicBezierButton] Unexpected number of points:", points);
          }
          cubicBeziers.push({start: points[0], control1: points[1], control2: points[2], end: points[3], move: move});
        } else if ((matches = moveObj.autoguiMove.match(/^LA_([ACRX]{7})/))) {
          const parsedData = [...moveObj.autoguiMove.matchAll(/_(-?\d+(\.\d+)?)/g)].map(match => parseFloat(match[1]));
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
        if (!aFromCoords || !aToCoords || !bFromCoords || !bToCoords) {
          return 0;
        }
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

  // Marble Circuit hover overlay helpers
  const marbleTokenOrder = ["1", "2", "3", "4"] as const;

  const marbleHoverPlacementMoveByToken = computed(() => {
    const res: Record<string, string | null> = { "1": null, "2": null, "3": null, "4": null };
    if (!isMarbleCircuitTheme.value) return res;
    if (hoveredSlotIndex.value === null) return res;

    const slot = hoveredSlotIndex.value;
    const rem = marbleRemCounts.value;
    const kindToToken: Record<string, string> = { T: "1", O: "2", Y: "3", M: "4" };

    for (const moveObj of Object.values(currentAvailableMoves.value)) {
      const au = moveObj.autoguiMove;
      const m = au.match(/^M_(\d+)_([TOMY])_x$/);
      if (!m) continue;
      const center = parseInt(m[1], 10);
      if (center !== slot) continue;
      const kind = m[2];
      const tokenChar = kindToToken[kind];
      if (!tokenChar) continue;
      if (rem && (rem as any)[tokenChar] <= 0) continue;
      res[tokenChar] = au;
    }
    return res;
  });

  const marbleHoverRemoveMove = computed(() => {
    if (!isMarbleCircuitTheme.value) return null as string | null;
    if (hoveredSlotIndex.value === null) return null;
    const slot = hoveredSlotIndex.value;
    for (const moveObj of Object.values(currentAvailableMoves.value)) {
      const au = moveObj.autoguiMove;
      const m = au.match(/^R_(\d+)_x$/);
      if (!m) continue;
      const center = parseInt(m[1], 10);
      if (center === slot) return au;
    }
    return null;
  });

  const marbleHoverOccupiedTokenChar = computed(() => {
    if (!isMarbleCircuitTheme.value) return null as string | null;
    if (hoveredSlotIndex.value === null) return null;
    const slot = hoveredSlotIndex.value;
    const boardStr = autoguiPositionData.value.board;
    if (!boardStr || slot < 0 || slot >= boardStr.length) return null;
    const ch = boardStr[slot];
    if (ch in charImages.value) return ch;
    return null;
  });

  const marbleHoverOverlayVisible = computed(() => {
    const placementMoves = Object.values(marbleHoverPlacementMoveByToken.value).some((v) => !!v);
    return placementMoves || !!marbleHoverRemoveMove.value;
  });

  const marbleHoverPanelX = computed(() => {
    if (!isMarbleCircuitTheme.value) return 0;
    if (hoveredSlotIndex.value === null) return 0;
    const slot = hoveredSlotIndex.value;
    const c = centers.value[slot];
    return c ? c[0] - 14.0 : 0;
  });

  const marbleHoverPanelY = computed(() => {
    if (!isMarbleCircuitTheme.value) return 0;
    if (hoveredSlotIndex.value === null) return 0;
    const slot = hoveredSlotIndex.value;
    const c = centers.value[slot];
    // Panel slightly above the hovered slot (so placement buttons float over it).
    return c ? c[1] - 24.5 : 0;
  });

  const listedMoves = computed(() => autoguiPositionData.value.isValidAutoguiPositionString ? autoguiPositionData.value.listedButtons : Object.values(currentAvailableMoves.value));
  const displayedListedMoves = computed(() => {
    const moves = listedMoves.value as any[];
    if (!isMarbleCircuitTheme.value) return moves;
    if (!marblePullActivated.value) return [];
    // For Marble Circuit, we only want to reveal the "player1fail" option after the lever click.
    return moves.filter((m: any) => {
      const mv = m?.moveValue;
      const ms = m?.move;
      return mv === "player1fail" || ms === "player1fail" || (typeof mv === "string" && mv.includes("player1fail")) || (typeof ms === "string" && ms.includes("player1fail"));
    });
  });

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

  const highlightedMove = computed(() => store.getters.currentHighlightedMove);
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
            &.highlighted {
              border: 0.1rem solid var(--moveHighlightColor);
              background-color: var(--moveHighlightColor);
              opacity: 1 !important;
            }
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

  .iag-goal-exit {
    fill: #f2f2f2;
    stroke: #222;
    stroke-width: 0.06em;
    paint-order: stroke fill;
    font-weight: 700;
    text-anchor: middle;
    alignment-baseline: middle;
  }

  .iag-goal-exit-current {
    font-weight: 800;
    text-anchor: start;
    alignment-baseline: middle;
  }

  .iag-legend-text {
    fill: #111;
    stroke: #fff;
    stroke-width: 0.06em;
    paint-order: stroke fill;
    font-weight: 700;
    text-anchor: start;
    alignment-baseline: middle;
  }

  .iag-hover-panel-bg {
    fill: rgba(20, 20, 20, 0.92);
    stroke: #222;
    stroke-width: 0.12em;
  }

  .marble-hover-piece-btn {
    cursor: pointer;
    opacity: 0.98;
  }

  .marble-hover-remove-bg {
    fill: rgba(240, 240, 240, 0.45);
    stroke: #222;
    stroke-width: 0.12em;
  }

  .marble-hover-remove-x {
    fill: #f2f2f2;
    stroke: #222;
    stroke-width: 0.08em;
    font-weight: 900;
    cursor: pointer;
    user-select: none;
  }

  .iag-button-point {
    transform-origin: var(--tOrigin);
    
    [data-turn="1"] &.move { fill: var(--turn1Color); stroke: var(--turn1Color); }
    [data-turn="2"] &.move { fill: var(--turn2Color); stroke: var(--turn1Color); }

    &.move.hint- {
      &win {
        fill: var(--winColor);
        stroke: var(--winColor);
      }
      &draw {
        fill: var(--drawColor);
        stroke: var(--drawColor);
      }
      &tie {
        fill: var(--tieColor);
        stroke: var(--tieColor);
      }
      &lose     {
        fill: var(--loseColor);
        stroke: var(--loseColor);
      }
      &unsolved {
        fill: var(--unsolvedColor);
        stroke: var(--unsolvedColor);
      }
      &win,&draw,&tie,&lose,&unsolved {
        &.highlighted {
          fill: var(--moveHighlightColor);
          stroke: var(--moveHighlightColor);
          animation-name: pulsing-point;
          animation-duration: 0.3s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          animation-direction: alternate;
          opacity: 1;
        }
      }
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
      &win,&draw,&tie,&lose,&unsolved {
        &.highlighted {
          fill: var(--moveHighlightColor);
          stroke: var(--moveHighlightColor);
          animation-name: pulsing-arrow;
          animation-duration: 0.3s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          animation-direction: alternate;
          opacity: 1;
        }
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
      &win,&draw,&tie,&lose,&unsolved {
        &.highlighted {
          stroke: var(--moveHighlightColor);
          animation-name: pulsing-line;
          animation-duration: 0.3s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          animation-direction: alternate;
          opacity: 1;
        }
      }
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