<template>
    <div id="app-game-vvh-body">
        <p id="color-guides" v-if="showVvhGuides">
            <span class="uni-win color">win</span>
            <span class="uni-draw color">draw</span>
            <span class="uni-tie color">tie</span>
            <span class="uni-lose color">lose</span>
        </p>
        <p id="winning-directions" v-if="showVvhGuides">
            <template v-if="isPuzzleGame">
                <b class="uni-turn-1 player">{{ currentLeftPlayerName }} Winning ⮕</b>
            </template>
            <template v-else>
                <b class="uni-turn-1 player">⬅ {{ currentLeftPlayerName }} Winning</b>
                <b class="uni-turn-2 player"> {{ currentRightPlayerName }} Winning ⮕</b>
            </template>
        </p>
        <p class="top x-axis-label" v-if="showVvhGuides">
            <b>Remoteness</b>
        </p>
        <div id="body">
            <p id="left-y-axis-label" v-if="showVvhGuides && !isPuzzleGame">
                <b>Moves</b>
            </p>

            <!-- Chart -->
            <svg id="chart" :viewBox="`0 0 ${chartWidth} ${chartHeight}`" xmlns="http://www.w3.org/2000/svg">
                <!-- D Symbols -->
                <text class="draw-symbol" :x="chartWidth / 2" :y="xCoordinateHeight / 2" dominant-baseline="middle" text-anchor="middle" :textLength="0.3 * columnWidth" lengthAdjust="spacingAndGlyphs">D</text>
                <text class="draw-symbol" :x="chartWidth / 2" :y="chartHeight - xCoordinateHeight / 3" dominant-baseline="middle" text-anchor="middle" :textLength="0.3 * columnWidth" lengthAdjust="spacingAndGlyphs">D</text>

                <!-- Remoteness Coordinates -->
                <template v-for="(_, remoteness) in maximumRemoteness + 1" :key="remoteness">
                    <text class="remoteness-coordinate" v-if="!isPuzzleGame && remoteness % xInterval === 0" :x="yCoordinateWidth + remoteness * columnWidth" :y="xCoordinateHeight / 2" dominant-baseline="middle" text-anchor="middle" :textLength="0.3 * columnWidth" lengthAdjust="spacingAndGlyphs">{{ remoteness }}</text>
                    <text class="remoteness-coordinate" v-if="remoteness % xInterval === 0" :x="chartWidth - (yCoordinateWidth + remoteness * columnWidth)" :y="xCoordinateHeight / 2" dominant-baseline="middle" text-anchor="middle" :textLength="0.3 * columnWidth" lengthAdjust="spacingAndGlyphs">{{ remoteness }}</text>
                    <text class="remoteness-coordinate" v-if="!isPuzzleGame && remoteness % xInterval === 0" :x="yCoordinateWidth + remoteness * columnWidth" :y="chartHeight - xCoordinateHeight / 3" dominant-baseline="middle" text-anchor="middle" :textLength="0.3 * columnWidth" lengthAdjust="spacingAndGlyphs">{{ remoteness }}</text>
                    <text class="remoteness-coordinate" v-if="remoteness % xInterval === 0" :x="chartWidth - (yCoordinateWidth + remoteness * columnWidth)" :y="chartHeight - xCoordinateHeight / 3" dominant-baseline="middle" text-anchor="middle" :textLength="0.3 * columnWidth" lengthAdjust="spacingAndGlyphs">{{ remoteness }}</text>
                </template>

                <!-- Move Coordinates -->
                <template v-if="currentRoundId >= 2">
                    <template v-for="roundNumber in currentRoundId - 1" :key="roundNumber">
                        <text class="move-coordinate" v-if="isPuzzleGame || currentRounds[roundNumber].playerId === currentLeftPlayerId" :x="yCoordinateWidth / 2" :y="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" dominant-baseline="middle" text-anchor="middle" :textLength="0.6 * yCoordinateWidth" lengthAdjust="spacingAndGlyphs">{{ currentRounds[roundNumber].move }}</text>
                        <text class="move-coordinate" v-else :x="chartWidth - yCoordinateWidth / 2" :y="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" dominant-baseline="middle" text-anchor="middle" :textLength="0.6 * yCoordinateWidth" lengthAdjust="spacingAndGlyphs">{{ currentRounds[roundNumber].move }}</text>
                    </template>
                    <template v-if="isEndOfMatch">
                        <template v-if="isPuzzleGame">
                            <text class="move-coordinate" :x="yCoordinateWidth / 2" :y="xCoordinateHeight + currentRoundId * rowHeight - rowHeight / 3" dominant-baseline="middle" text-anchor="middle" :textLength="0.3 * yCoordinateWidth" lengthAdjust="spacingAndGlyphs">🥳</text>
                        </template>
                        <template v-else-if="currentPositionValue === 'tie'">
                            <text class="move-coordinate" :x="yCoordinateWidth / 2" :y="xCoordinateHeight + currentRoundId * rowHeight - rowHeight / 3" dominant-baseline="middle" text-anchor="middle" :textLength="0.3 * yCoordinateWidth" lengthAdjust="spacingAndGlyphs">🤔</text>
                            <text class="move-coordinate" :x="chartWidth - yCoordinateWidth / 2" :y="xCoordinateHeight + currentRoundId * rowHeight - rowHeight / 3" dominant-baseline="middle" text-anchor="middle" :textLength="0.3 * yCoordinateWidth" lengthAdjust="spacingAndGlyphs">🤔</text>
                        </template>
                        <template v-else>
                            <text class="move-coordinate" :x="yCoordinateWidth / 2" :y="xCoordinateHeight + currentRoundId * rowHeight - rowHeight / 3" dominant-baseline="middle" text-anchor="middle" :textLength="0.3 * yCoordinateWidth" lengthAdjust="spacingAndGlyphs">{{ (currentPlayerId === currentLeftPlayerId && currentPositionValue === "win") || (currentPlayerId !== currentLeftPlayerId && currentPositionValue === "lose") ? "🥳" : "😢" }}</text>
                            <text class="move-coordinate" :x="chartWidth - yCoordinateWidth / 2" :y="xCoordinateHeight + currentRoundId * rowHeight - rowHeight / 3" dominant-baseline="middle" text-anchor="middle" :textLength="0.3 * yCoordinateWidth" lengthAdjust="spacingAndGlyphs">{{ (currentPlayerId !== currentLeftPlayerId && currentPositionValue === "win") || (currentPlayerId === currentLeftPlayerId && currentPositionValue === "lose") ? "🥳" : "😢" }}</text>
                        </template>
                    </template>
                </template>

                <!-- Grid Base -->
                <rect id="grid-base" :x="yCoordinateWidth" :y="xCoordinateHeight" :width="gridWidth" :height="gridHeight" />

                <!-- Round Rows -->
                <template v-for="roundNumber in currentRoundId" :key="roundNumber">
                    <rect class="round-row" :class="`turn-${turn(currentRounds[roundNumber].playerId)}`" :x="yCoordinateWidth" :y="xCoordinateHeight + (roundNumber - 1) * rowHeight" :width="gridWidth" :height="rowHeight" />
                </template>
                <rect class="turn-0 round-row" v-if="isEndOfMatch" :x="yCoordinateWidth" :y="chartHeight - xCoordinateHeight - rowHeight" :width="gridWidth" :height="rowHeight"></rect>

                <!-- Remoteness Bars -->
                <template v-for="(_, remoteness) in maximumRemoteness + 2" :key="remoteness">
                    <line :class="remoteness % xInterval !== 0 ? 'remoteness-bar' : 'remoteness-interval-bar'" :x1="yCoordinateWidth + remoteness * columnWidth" :y1="xCoordinateHeight" :x2="yCoordinateWidth + remoteness * columnWidth" :y2="xCoordinateHeight + gridHeight" :stroke-width="remoteness % xInterval !== 0 ? xBarWidth : xIntervalBarWidth" />
                    <line v-if="!isPuzzleGame" :class="remoteness % xInterval !== 0 ? 'remoteness-bar' : 'remoteness-interval-bar'" :x1="chartWidth - (yCoordinateWidth + remoteness * columnWidth)" :y1="xCoordinateHeight" :x2="chartWidth - (yCoordinateWidth + remoteness * columnWidth)" :y2="xCoordinateHeight + gridHeight" :stroke-width="remoteness % xInterval !== 0 ? xBarWidth : xIntervalBarWidth" />
                </template>

                <!-- Next Moves' Position Values -->
                <template v-if="showNextMoves">
                    <template v-for="roundNumber in currentRoundId" :key="roundNumber">
                        <template v-for="nextMove in currentRounds[roundNumber].position.availableMoves" :key="nextMove.move">
                            <template v-if="nextMove.moveValue === 'draw'">
                                <circle :class="showNextMoveHints ? 'draw' : ''" class="next-move-position-value" :cx="chartWidth / 2" :cy="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :r="nextMovePositionValueSize" :stroke-width="4 * nextMovePositionValueSize" />
                            </template>
                            <template v-if="nextMove.moveValue === 'tie'">
                                <circle :class="showNextMoveHints ? 'tie' : ''" class="next-move-position-value" :cx="yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth" :cy="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :r="nextMovePositionValueSize" :stroke-width="4 * nextMovePositionValueSize" />
                                <circle :class="showNextMoveHints ? 'tie' : ''" class="next-move-position-value" :cx="chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth)" :cy="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :r="nextMovePositionValueSize" :stroke-width="4 * nextMovePositionValueSize" />
                            </template>
                            <template v-else>
                                <circle :class="showNextMoveHints ? nextMove.positionValue : ''" class="next-move-position-value" :cx="nextMove.moveValue === 'win' ? (turn(currentRounds[roundNumber].playerId) === 1 ? yCoordinateWidth + nextMove.remoteness * columnWidth : chartWidth - (yCoordinateWidth + nextMove.remoteness * columnWidth)) : turn(currentRounds[roundNumber].playerId) === 1 ? chartWidth - (yCoordinateWidth + nextMove.remoteness * columnWidth) : yCoordinateWidth + nextMove.remoteness * columnWidth" :cy="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :r="nextMovePositionValueSize" :stroke-width="4 * nextMovePositionValueSize" />
                            </template>
                        </template>
                    </template>
                </template>

                <!-- Position Value Links -->
                <template v-if="currentRoundId >= 3">
                    <template v-for="roundNumber in isEndOfMatch ? currentRoundId - 1 : currentRoundId - 2" :key="roundNumber">
                        <template v-if="currentRounds[roundNumber].position.positionValue === 'draw'">
                            <template v-if="currentRounds[roundNumber + 1].position.positionValue === 'draw'">
                                <line :class="`${currentRounds[roundNumber].moveValue} link`" :x1="chartWidth / 2" :y1="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :x2="chartWidth / 2" :y2="xCoordinateHeight + (roundNumber + 1) * rowHeight - rowHeight / 2" stroke-width="0.4" />
                            </template>
                            <template v-else-if="currentRounds[roundNumber + 1].position.positionValue === 'tie'">
                                <line :class="`${currentRounds[roundNumber].moveValue} link`" :x1="chartWidth / 2" :y1="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :x2="yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth" :y2="xCoordinateHeight + (roundNumber + 1) * rowHeight - rowHeight / 2" stroke-width="0.4" />
                                <line :class="`${currentRounds[roundNumber].moveValue} link`" :x1="chartWidth / 2" :y1="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :x2="chartWidth - (yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth)" :y2="xCoordinateHeight + (roundNumber + 1) * rowHeight - rowHeight / 2" stroke-width="0.4" />
                            </template>
                            <template v-else>
                                <line :class="`${currentRounds[roundNumber].moveValue} link`" :x1="chartWidth / 2" :y1="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :x2="currentRounds[roundNumber + 1].position.positionValue === 'win' ? (turn(currentRounds[roundNumber + 1].playerId) === 1 ? yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth)) : turn(currentRounds[roundNumber + 1].playerId) === 1 ? chartWidth - (yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth) : yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth" :y2="xCoordinateHeight + (roundNumber + 1) * rowHeight - rowHeight / 2" stroke-width="0.4" />
                            </template>
                        </template>
                        <template v-if="currentRounds[roundNumber].position.positionValue === 'tie'">
                            <template v-if="currentRounds[roundNumber + 1].position.positionValue === 'draw'">
                                <line :class="`${currentRounds[roundNumber].moveValue} link`" :x1="yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth" :y1="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :x2="chartWidth / 2" :y2="xCoordinateHeight + (roundNumber + 1) * rowHeight - rowHeight / 2" stroke-width="0.4" />
                                <line :class="`${currentRounds[roundNumber].moveValue} link`" :x1="chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth)" :y1="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :x2="chartWidth / 2" :y2="xCoordinateHeight + (roundNumber + 1) * rowHeight - rowHeight / 2" stroke-width="0.4" />
                            </template>
                            <template v-else-if="currentRounds[roundNumber + 1].position.positionValue === 'tie'">
                                <line :class="`${currentRounds[roundNumber].moveValue} link`" :x1="yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth" :y1="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :x2="yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth" :y2="xCoordinateHeight + (roundNumber + 1) * rowHeight - rowHeight / 2" stroke-width="0.4" />
                                <line :class="`${currentRounds[roundNumber].moveValue} link`" :x1="chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth)" :y1="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :x2="chartWidth - (yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth)" :y2="xCoordinateHeight + (roundNumber + 1) * rowHeight - rowHeight / 2" stroke-width="0.4" />
                            </template>
                            <template v-else>
                                <line :class="`${currentRounds[roundNumber].moveValue} link`" :x1="yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth" :y1="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :x2="currentRounds[roundNumber + 1].position.positionValue === 'win' ? (turn(currentRounds[roundNumber + 1].playerId) === 1 ? yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth)) : turn(currentRounds[roundNumber + 1].playerId) === 1 ? chartWidth - (yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth) : yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth" :y2="xCoordinateHeight + (roundNumber + 1) * rowHeight - rowHeight / 2" stroke-width="0.4" />
                                <line :class="`${currentRounds[roundNumber].moveValue} link`" :x1="chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth)" :y1="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :x2="currentRounds[roundNumber + 1].position.positionValue === 'win' ? (turn(currentRounds[roundNumber + 1].playerId) === 1 ? yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth)) : turn(currentRounds[roundNumber + 1].playerId) === 1 ? chartWidth - (yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth) : yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth" :y2="xCoordinateHeight + (roundNumber + 1) * rowHeight - rowHeight / 2" stroke-width="0.4" />
                            </template>
                        </template>
                        <template v-else>
                            <template v-if="currentRounds[roundNumber + 1].position.positionValue === 'draw'">
                                <line :class="`${currentRounds[roundNumber].moveValue} link`" :x1="currentRounds[roundNumber].position.positionValue === 'win' ? (turn(currentRounds[roundNumber].playerId) === 1 ? yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth)) : turn(currentRounds[roundNumber].playerId) === 1 ? chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth) : yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth" :y1="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :x2="chartWidth / 2" :y2="xCoordinateHeight + (roundNumber + 1) * rowHeight - rowHeight / 2" stroke-width="0.4" />
                            </template>
                            <template v-else-if="currentRounds[roundNumber + 1].position.positionValue === 'tie'">
                                <line :class="`${currentRounds[roundNumber].moveValue} link`" :x1="currentRounds[roundNumber].position.positionValue === 'win' ? (turn(currentRounds[roundNumber].playerId) === 1 ? yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth)) : turn(currentRounds[roundNumber].playerId) === 1 ? chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth) : yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth" :y1="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :x2="yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth" :y2="xCoordinateHeight + (roundNumber + 1) * rowHeight - rowHeight / 2" stroke-width="0.4" />
                                <line :class="`${currentRounds[roundNumber].moveValue} link`" :x1="currentRounds[roundNumber].position.positionValue === 'win' ? (turn(currentRounds[roundNumber].playerId) === 1 ? yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth)) : turn(currentRounds[roundNumber].playerId) === 1 ? chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth) : yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth" :y1="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :x2="chartWidth - (yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth)" :y2="xCoordinateHeight + (roundNumber + 1) * rowHeight - rowHeight / 2" stroke-width="0.4" />
                            </template>
                            <template v-else>
                                <line :class="`${currentRounds[roundNumber].moveValue} link`" :x1="currentRounds[roundNumber].position.positionValue === 'win' ? (turn(currentRounds[roundNumber].playerId) === 1 ? yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth)) : turn(currentRounds[roundNumber].playerId) === 1 ? chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth) : yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth" :y1="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :x2="currentRounds[roundNumber + 1].position.positionValue === 'win' ? (turn(currentRounds[roundNumber + 1].playerId) === 1 ? yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth)) : turn(currentRounds[roundNumber + 1].playerId) === 1 ? chartWidth - (yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth) : yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth" :y2="xCoordinateHeight + (roundNumber + 1) * rowHeight - rowHeight / 2" stroke-width="0.4" />
                            </template>
                        </template>
                    </template>
                </template>

                <!-- Position Values -->
                <template v-if="currentRoundId >= 2">
                    <template v-for="roundNumber in isEndOfMatch ? currentRoundId : currentRoundId - 1" :key="roundNumber">
                        <template v-if="currentRounds[roundNumber].position.positionValue === 'draw'">
                            <circle class="draw position-value" :cx="chartWidth / 2" :cy="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :r="positionValueSize" :stroke-width="4 * positionValueSize" />
                        </template>
                        <template v-else-if="currentRounds[roundNumber].position.positionValue === 'tie'">
                            <circle class="tie position-value" :cx="yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth" :cy="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :r="positionValueSize" :stroke-width="4 * positionValueSize" />
                            <line class="tie position-value link" :x1="yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth" :y1="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :x2="chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth)" :y2="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :stroke-width="4 * linkWidth" />
                            <circle class="tie position-value" :cx="chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth)" :cy="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :r="positionValueSize" :stroke-width="4 * positionValueSize" />
                        </template>
                        <template v-else>
                            <circle :class="currentRounds[roundNumber].position.positionValue" class="position-value" :cx="currentRounds[roundNumber].position.positionValue === 'win' ? (turn(currentRounds[roundNumber].playerId) === 1 ? yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth)) : turn(currentRounds[roundNumber].playerId) === 1 ? chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth) : yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth" :cy="xCoordinateHeight + roundNumber * rowHeight - rowHeight / 2" :r="positionValueSize" :stroke-width="4 * positionValueSize" />
                        </template>
                    </template>
                </template>
            </svg>

            <p id="right-y-axis-label" v-if="showVvhGuides">
                <b>Moves</b>
            </p>
        </div>
        <p class="bottom x-axis-label" v-if="showVvhGuides">
            <b>Remoteness</b>
        </p>
        <div id="meters" v-if="showVvhMeters">
            <div class="meter">
                <p class="label">Remoteness Coordinate Height</p>
                <VueSlider v-model="xCoordinateHeight" :min="3" :max="20" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Move Coordinate Width</p>
                <VueSlider v-model="yCoordinateWidth" :min="10" :max="30" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Row Height</p>
                <VueSlider v-model="rowHeight" :min="3" :max="20" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Chart Width</p>
                <VueSlider v-model="chartWidth" :min="51" :max="200" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Position Value Size</p>
                <VueSlider v-model="positionValueSize" :min="0.2" :max="2" :interval="0.2" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Next Move Position Value Size</p>
                <VueSlider v-model="nextMovePositionValueSize" :min="0.1" :max="1" :interval="0.1" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Link Width</p>
                <VueSlider v-model="linkWidth" :min="0.1" :max="1" :interval="0.1" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Remoteness Bar Width</p>
                <VueSlider v-model="xBarWidth" :min="0.1" :max="1.1" :interval="0.1" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Remoteness Interval Bar Width</p>
                <VueSlider v-model="xIntervalBarWidth" :min="0.2" :max="2.2" :interval="0.2" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Remoteness Interval</p>
                <VueSlider v-model="xInterval" :min="1" :max="maximumRemoteness" :tooltip="'active'" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref } from "vue";
    import { useStore } from "../../scripts/plugins/store";
    import VueSlider from "vue-slider-component";
    import "vue-slider-component/theme/default.css";

    const store = useStore();

    const options = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.options : undefined));
    const showNextMoves = computed(() => (options.value ? options.value.showNextMoves : true));
    const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));
    const showVvhGuides = computed(() => (options.value ? options.value.showVvhGuides : true));
    const showVvhMeters = computed(() => (options.value ? options.value.showVvhMeters : false));

    const currentLeftPlayerId = computed(() => (store.getters.currentLeftPlayer ? store.getters.currentLeftPlayer.id : ""));
    const currentLeftPlayerName = computed(() => (store.getters.currentLeftPlayer ? store.getters.currentLeftPlayer.name : ""));
    const currentPlayerId = computed(() => store.getters.currentPlayer.id);
    const currentPositionValue = computed(() => store.getters.currentPositionValue);
    const currentRightPlayerName = computed(() => (store.getters.currentRightPlayer ? store.getters.currentRightPlayer.name : ""));
    const currentRoundId = computed(() => store.getters.currentRoundId);
    const currentRounds = computed(() => store.getters.currentRounds);

    const turn = (playerId: string) => (store.getters.currentLeftPlayer ? (store.getters.currentLeftPlayer.id === playerId ? 1 : 2) : 0);

    const isPuzzleGame = computed(() => store.getters.currentGameType === "puzzles");
    const maximumRemoteness = computed(() => store.getters.maximumRemoteness(1, store.getters.currentRoundId));
    const isEndOfMatch = computed(() => store.getters.isEndOfMatch);

    const rowHeight = ref(4);
    const xCoordinateHeight = ref(4);
    const rowCount = computed(() => currentRoundId.value);
    const gridHeight = computed(() => rowHeight.value * rowCount.value);
    const chartHeight = computed(() => gridHeight.value + 2 * xCoordinateHeight.value);

    const chartWidth = ref(100);
    const yCoordinateWidth = ref(10);
    const columnCount = computed(() => (isPuzzleGame.value ? maximumRemoteness.value + 1 : 2 * (maximumRemoteness.value + 1)));
    const gridWidth = computed(() => chartWidth.value - (isPuzzleGame.value ? yCoordinateWidth.value : 2 * yCoordinateWidth.value));
    const columnWidth = computed(() => gridWidth.value / columnCount.value);
    const positionValueSize = ref(0.4);
    const nextMovePositionValueSize = ref(0.2);
    const xInterval = ref(5);
    const linkWidth = ref(0.2);
    const xBarWidth = ref(0.2);
    const xIntervalBarWidth = ref(0.4);
</script>

<style lang="scss" scoped>
    #app-game-vvh-body {
        border-radius: 1rem;
        border: 0.1rem solid var(--neutralColor);
        padding: 1rem;
        > #color-guides {
            margin: 1rem;
            text-align: center;
            > .color {
                border-radius: 1rem;
                margin: 1rem;
                padding: 0 0.5rem;
            }
        }
        > #winning-directions {
            align-content: normal;
            align-items: center;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: center;
            margin: 1rem;
            text-align: center;
            > .player {
                padding: 0 0.5rem;
            }
        }
        > .x-axis-label {
            text-align: center;
        }
        > #body {
            align-content: normal;
            align-items: center;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: center;
            > * {
                flex: 1 1 auto;
            }
            > #left-y-axis-label {
                text-align: center;
                transform: rotate(-90deg);
            }
            > #chart {
                > .draw-symbol {
                    font-size: 0.2rem;
                }
                > .remoteness-coordinate {
                    font-size: 0.2rem;
                }
                > .move-coordinate {
                    font-size: 0.2rem;
                }
                > #grid-base {
                    fill: white;
                }
                > .round-row {
                    &.turn-0 {
                        fill: var(--neutralColor);
                    }
                    &.turn-1 {
                        fill: var(--turn1Color);
                        opacity: 30%;
                    }
                    &.turn-2 {
                        fill: var(--turn2Color);
                        opacity: 30%;
                    }
                }
                > .remoteness-bar,
                > .remoteness-interval-bar {
                    stroke: var(--primaryColor);
                }
                > .position-value,
                > .next-move-position-value,
                > .link {
                    &.draw {
                        fill: var(--drawColor);
                        stroke: var(--drawColor);
                    }
                    &.tie {
                        fill: var(--tieColor);
                        stroke: var(--tieColor);
                    }
                    &.lose {
                        fill: var(--loseColor);
                        stroke: var(--loseColor);
                    }
                    &.win {
                        fill: var(--winColor);
                        stroke: var(--winColor);
                    }
                }
            }
            > #right-y-axis-label {
                text-align: center;
                transform: rotate(90deg);
            }
        }
        #meters {
            padding: 1rem 10%;
            > .meter {
                align-content: normal;
                align-items: center;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-between;
                padding: 1rem;
                position: relative;
                > * {
                    flex: 1 1 auto;
                }
                > .label {
                    line-height: 1rem;
                    max-width: 30%;
                    text-align: left;
                }
            }
        }
    }
</style>
