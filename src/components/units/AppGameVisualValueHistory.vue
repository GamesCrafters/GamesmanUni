<template>
    <div id="vvh">
        <h2 id="title">Visual Value History</h2>
        <p id="legends">
            <span class="uni-win">win</span>
            <span class="uni-draw">draw</span>
            <span class="uni-tie">tie</span>
            <span class="uni-lose">lose</span>
        </p>
        <p id="players" v-if="isPuzzleGame">
            <b class="uni-turn-1">Player: {{ currentLeftPlayerName }} Winning ⮕</b>
        </p>
        <p id="players" v-else>
            <b class="uni-turn-1">⬅ Left Player: {{ currentLeftPlayerName }} Winning</b>
            <b class="uni-turn-2">Right Player: {{ currentRightPlayerName }} Winning ⮕</b>
        </p>
        <p id="top-label"><b>Remoteness</b></p>
        <div id="body">
            <p id="left-label"><b>Moves</b></p>
            <svg id="chart" :viewBox="`0 0 ${chartWidth} ${chartHeight}`" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <circle id="current-position" cx="0" cy="0" :r="currentPositionSize" />
                    <g id="current-tie-position">
                        <line :x1="-columnWidth" y1="0" :x2="columnWidth" y2="0" :stroke-width="currentPositionSize" />
                        <use href="#current-position" :x="-columnWidth" y="0" />
                        <use href="#current-position" :x="columnWidth" y="0" />
                    </g>
                    <circle id="next-move-position" cx="0" cy="0" :r="nextMovePositionSize" />
                    <g id="next-move-tie-position">
                        <line :x1="-columnWidth" y1="0" :x2="columnWidth" y2="0" :stroke-width="nextMovePositionSize" />
                        <use href="#next-move-position" :x="-columnWidth" y="0" />
                        <use href="#next-move-position" :x="columnWidth" y="0" />
                    </g>
                    <line id="remoteness-bar" x1="0" y1="0" x2="0" :y2="gridHeight" />
                    <line id="remoteness-interval-bar" x1="0" y1="0" x2="0" :y2="gridHeight" />
                </defs>
                <text class="draw-symbol" :x="chartWidth / 2" :y="rowHeight / 2" dominant-baseline="middle" text-anchor="middle">D</text>
                <text class="draw-symbol" :x="chartWidth / 2" :y="chartHeight - rowHeight / 2" dominant-baseline="middle" text-anchor="middle">D</text>
                <template v-for="(_, remoteness) in maximumRemoteness + 1" :key="remoteness">
                    <text class="remoteness-coordinate" v-if="remoteness % xInterval === 0" :x="yCoordinateWidth + remoteness * columnWidth" :y="rowHeight / 2" dominant-baseline="middle" text-anchor="middle">{{ remoteness }}</text>
                    <text class="remoteness-coordinate" v-if="remoteness % xInterval === 0" :x="chartWidth - (yCoordinateWidth + remoteness * columnWidth)" :y="rowHeight / 2" dominant-baseline="middle" text-anchor="middle">{{ remoteness }}</text>
                    <text class="remoteness-coordinate" v-if="remoteness % xInterval === 0" :x="yCoordinateWidth + remoteness * columnWidth" :y="chartHeight - rowHeight / 2" dominant-baseline="middle" text-anchor="middle">{{ remoteness }}</text>
                    <text class="remoteness-coordinate" v-if="remoteness % xInterval === 0" :x="chartWidth - (yCoordinateWidth + remoteness * columnWidth)" :y="chartHeight - rowHeight / 2" dominant-baseline="middle" text-anchor="middle">{{ remoteness }}</text>
                </template>
                <template v-for="roundNumber in currentRoundId" :key="roundNumber">
                    <text class="move-coordinate" v-if="currentRounds[roundNumber].playerId === currentLeftPlayerId" :x="yCoordinateWidth / 2" :y="rowHeight / 2 + roundNumber * rowHeight" dominant-baseline="middle" text-anchor="middle" :textLength="0.8 * yCoordinateWidth" lengthAdjust="spacingAndGlyphs">{{ currentRounds[roundNumber].move }}</text>
                    <text class="move-coordinate" v-else :x="chartWidth - yCoordinateWidth / 2" :y="rowHeight / 2 + roundNumber * rowHeight" dominant-baseline="middle" text-anchor="middle" :textLength="0.8 * yCoordinateWidth" lengthAdjust="spacingAndGlyphs">{{ currentRounds[roundNumber].move }}</text>
                </template>
                <rect id="grid" :x="yCoordinateWidth" :y="rowHeight" :width="gridWidth" :height="gridHeight" />
                <template v-for="roundNumber in currentRoundId" :key="roundNumber">
                    <rect class="round" :class="`row-turn-${turn(currentRounds[roundNumber].playerId)}`" v-if="currentRounds[roundNumber].position.remoteness || currentRounds[roundNumber].position === 'draw'" :x="yCoordinateWidth" :y="roundNumber * rowHeight" :width="gridWidth" :height="rowHeight" />
                </template>
                <template v-for="(_, remoteness) in maximumRemoteness + 2" :key="remoteness">
                    <use href="#remoteness-bar" v-if="remoteness % xInterval !== 0" :x="yCoordinateWidth + remoteness * columnWidth" :y="rowHeight" />
                    <use href="#remoteness-interval-bar" v-else :x="yCoordinateWidth + remoteness * columnWidth" :y="rowHeight" />
                    <use href="#remoteness-bar" v-if="remoteness % xInterval !== 0" :x="chartWidth - (yCoordinateWidth + remoteness * columnWidth)" :y="rowHeight" />
                    <use href="#remoteness-interval-bar" v-else :x="chartWidth - (yCoordinateWidth + remoteness * columnWidth)" :y="rowHeight" />
                </template>
                <template v-if="currentRoundId > 1">
                    <template v-for="roundNumber in currentRoundId - 2" :key="roundNumber">
                        <template v-if="currentRounds[roundNumber].position.positionValue === 'draw'">
                            <template v-if="currentRounds[roundNumber + 1].position.positionValue === 'draw'">
                                <line :class="`${currentRounds[roundNumber].moveValue}-color`" :x1="chartWidth / 2" :y1="rowHeight / 2 + roundNumber * rowHeight" :x2="chartWidth / 2" :y2="rowHeight / 2 + (roundNumber + 1) * rowHeight" stroke-width="0.4" />
                            </template>
                            <template v-else-if="currentRounds[roundNumber + 1].position.positionValue === 'tie'">
                                <line :class="`${currentRounds[roundNumber].moveValue}-color`" :x1="chartWidth / 2" :y1="rowHeight / 2 + roundNumber * rowHeight" :x2="chartWidth / 2 - columnWidth" :y2="rowHeight / 2 + (roundNumber + 1) * rowHeight" stroke-width="0.4" />
                                <line :class="`${currentRounds[roundNumber].moveValue}-color`" :x1="chartWidth / 2" :y1="rowHeight / 2 + roundNumber * rowHeight" :x2="chartWidth / 2 + columnWidth" :y2="rowHeight / 2 + (roundNumber + 1) * rowHeight" stroke-width="0.4" />
                            </template>
                            <template v-else>
                                <line :class="`${currentRounds[roundNumber].moveValue}-color`" :x1="chartWidth / 2" :y1="rowHeight / 2 + roundNumber * rowHeight" :x2="currentRounds[roundNumber + 1].playerId === currentLeftPlayerId ? yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth)" :y2="rowHeight / 2 + (roundNumber + 1) * rowHeight" stroke-width="0.4" />
                            </template>
                        </template>
                        <template v-if="currentRounds[roundNumber].position.positionValue === 'tie'">
                            <template v-if="currentRounds[roundNumber + 1].position.positionValue === 'draw'">
                                <line :class="`${currentRounds[roundNumber].moveValue}-color`" :x1="chartWidth / 2 - columnWidth" :y1="rowHeight / 2 + roundNumber * rowHeight" :x2="chartWidth / 2" :y2="rowHeight / 2 + (roundNumber + 1) * rowHeight" stroke-width="0.4" />
                                <line :class="`${currentRounds[roundNumber].moveValue}-color`" :x1="chartWidth / 2 + columnWidth" :y1="rowHeight / 2 + roundNumber * rowHeight" :x2="chartWidth / 2" :y2="rowHeight / 2 + (roundNumber + 1) * rowHeight" stroke-width="0.4" />
                            </template>
                            <template v-else-if="currentRounds[roundNumber + 1].position.positionValue === 'tie'">
                                <line :class="`${currentRounds[roundNumber].moveValue}-color`" :x1="chartWidth / 2 - columnWidth" :y1="rowHeight / 2 + roundNumber * rowHeight" :x2="chartWidth / 2 - columnWidth" :y2="rowHeight / 2 + (roundNumber + 1) * rowHeight" stroke-width="0.4" />
                                <line :class="`${currentRounds[roundNumber].moveValue}-color`" :x1="chartWidth / 2 + columnWidth" :y1="rowHeight / 2 + roundNumber * rowHeight" :x2="chartWidth / 2 + columnWidth" :y2="rowHeight / 2 + (roundNumber + 1) * rowHeight" stroke-width="0.4" />
                            </template>
                            <template v-else>
                                <line :class="`${currentRounds[roundNumber].moveValue}-color`" :x1="chartWidth / 2 - columnWidth" :y1="rowHeight / 2 + roundNumber * rowHeight" :x2="currentRounds[roundNumber + 1].playerId === currentLeftPlayerId ? yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth)" :y2="rowHeight / 2 + (roundNumber + 1) * rowHeight" stroke-width="0.4" />
                                <line :class="`${currentRounds[roundNumber].moveValue}-color`" :x1="chartWidth / 2 + columnWidth" :y1="rowHeight / 2 + roundNumber * rowHeight" :x2="currentRounds[roundNumber + 1].playerId === currentLeftPlayerId ? yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth)" :y2="rowHeight / 2 + (roundNumber + 1) * rowHeight" stroke-width="0.4" />
                            </template>
                        </template>
                        <template v-else>
                            <template v-if="currentRounds[roundNumber + 1].position.positionValue === 'draw'">
                                <line :class="`${currentRounds[roundNumber].moveValue}-color`" :x1="currentRounds[roundNumber].playerId === currentLeftPlayerId ? yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth)" :y1="rowHeight / 2 + roundNumber * rowHeight" :x2="chartWidth / 2" :y2="rowHeight / 2 + (roundNumber + 1) * rowHeight" stroke-width="0.4" />
                            </template>
                            <template v-else-if="currentRounds[roundNumber + 1].position.positionValue === 'tie'">
                                <line :class="`${currentRounds[roundNumber].moveValue}-color`" :x1="currentRounds[roundNumber].playerId === currentLeftPlayerId ? yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth)" :y1="rowHeight / 2 + roundNumber * rowHeight" :x2="chartWidth / 2 - columnWidth" :y2="rowHeight / 2 + (roundNumber + 1) * rowHeight" stroke-width="0.4" />
                                <line :class="`${currentRounds[roundNumber].moveValue}-color`" :x1="currentRounds[roundNumber].playerId === currentLeftPlayerId ? yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth)" :y1="rowHeight / 2 + roundNumber * rowHeight" :x2="chartWidth / 2 + columnWidth" :y2="rowHeight / 2 + (roundNumber + 1) * rowHeight" stroke-width="0.4" />
                            </template>
                            <template v-else>
                                <line :class="`${currentRounds[roundNumber].moveValue}-color`" :x1="currentRounds[roundNumber].playerId === currentLeftPlayerId ? yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth)" :y1="rowHeight / 2 + roundNumber * rowHeight" :x2="currentRounds[roundNumber + 1].playerId === currentLeftPlayerId ? yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber + 1].position.remoteness * columnWidth)" :y2="rowHeight / 2 + (roundNumber + 1) * rowHeight" stroke-width="0.4" />
                            </template>
                        </template>
                    </template>
                </template>
                <template v-if="showNextMoves">
                    <template v-for="roundNumber in currentRoundId" :key="roundNumber">
                        <template v-for="nextMove in currentRounds[roundNumber].position.availableMoves" :key="nextMove.move">
                            <use v-if="nextMove.positionValue === 'draw'" :class="showNextMoveHints ? `${nextMove.positionValue}-color` : `primary-color`" href="#next-move-position" :x="chartWidth / 2" :y="rowHeight / 2 + roundNumber * rowHeight" />
                            <use v-if="nextMove.positionValue === 'tie'" :class="showNextMoveHints ? `${nextMove.positionValue}-color` : `primary-color`" href="#next-move-tie-position" :x="chartWidth / 2" :y="rowHeight / 2 + roundNumber * rowHeight" />
                            <use v-else :class="showNextMoveHints ? `${nextMove.positionValue}-color` : `primary-color`" href="#next-move-position" :x="currentRounds[roundNumber].playerId !== currentLeftPlayerId ? yCoordinateWidth + nextMove.remoteness * columnWidth : chartWidth - (yCoordinateWidth + nextMove.remoteness * columnWidth)" :y="rowHeight / 2 + roundNumber * rowHeight" />
                        </template>
                    </template>
                </template>
                <template v-if="currentRoundId > 1">
                    <template v-for="roundNumber in currentRoundId - 1" :key="roundNumber">
                        <use v-if="currentRounds[roundNumber].position.positionValue === 'draw'" :class="`${currentRounds[roundNumber].position.positionValue}-color`" href="#current-position" :x="chartWidth / 2" :y="rowHeight / 2 + roundNumber * rowHeight" />
                        <use v-if="currentRounds[roundNumber].position.positionValue === 'tie'" :class="`${currentRounds[roundNumber].position.positionValue}-color`" href="#current-tie-position" :x="chartWidth / 2" :y="rowHeight / 2 + roundNumber * rowHeight" />
                        <use v-else :class="`${currentRounds[roundNumber].position.positionValue}-color`" href="#current-position" :x="currentRounds[roundNumber].playerId === currentLeftPlayerId ? yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth : chartWidth - (yCoordinateWidth + currentRounds[roundNumber].position.remoteness * columnWidth)" :y="rowHeight / 2 + roundNumber * rowHeight" />
                    </template>
                </template>
            </svg>
            <p id="right-label" v-if="!isPuzzleGame"><b>Moves</b></p>
        </div>
        <p id="bottom-label"><b>Remoteness</b></p>
        <div id="meters">
            <!-- might need to set up typescript type for VueSlider -->
            <div class="meter">
                <p class="label">Row Height</p>
                <VueSlider v-model="rowHeight" :min="3" :max="20" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Chart Width</p>
                <VueSlider v-model="chartWidth" :min="10" :max="200" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Remoteness Interval</p>
                <VueSlider v-model="xInterval" :min="5" :max="50" :interval="5" :tooltip="'active'" />
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
    const isPuzzleGame = computed(() => store.getters.currentGameType === "puzzles");
    const currentLeftPlayerName = computed(() => (store.getters.currentLeftPlayer ? store.getters.currentLeftPlayer.name : ""));
    const currentRightPlayerName = computed(() => store.getters.currentRightPlayer.name);
    const currentRoundId = computed(() => store.getters.currentRoundId);
    const maximumRemoteness = computed(() => store.getters.maximumRemoteness(1, store.getters.currentRoundId));
    const options = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.options : undefined));
    const showNextMoves = computed(() => (options.value ? options.value.showNextMoves : true));
    const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));
    const currentRemoteness = computed(() => store.getters.currentRemoteness);
    const currentPositionValue = computed(() => store.getters.currentPositionValue);
    const currentRounds = computed(() => store.getters.currentRounds);
    const currentLeftPlayerId = computed(() => (store.getters.currentLeftPlayer ? store.getters.currentLeftPlayer.id : ""));
    const turn = (playerId: string) => (store.getters.currentLeftPlayer ? (store.getters.currentLeftPlayer.id === playerId ? 1 : 2) : 0);
    const rowHeight = ref(4);
    const xCoordinateHeight = computed(() => rowHeight.value);
    const rowCount = computed(() => (currentRemoteness.value || currentPositionValue.value === "draw" ? currentRoundId.value : Math.max(currentRoundId.value - 1, 0)));
    const gridHeight = computed(() => rowHeight.value * rowCount.value);
    const chartHeight = computed(() => gridHeight.value + 2 * xCoordinateHeight.value);
    const chartWidth = ref(100);
    const yCoordinateWidth = ref(8);
    const columnCount = computed(() => (isPuzzleGame.value ? maximumRemoteness.value + 1 : 2 * (maximumRemoteness.value + 1)));
    const gridWidth = computed(() => chartWidth.value - 2 * yCoordinateWidth.value);
    const columnWidth = computed(() => gridWidth.value / columnCount.value);
    const currentPositionSize = computed(() => columnWidth.value / 5);
    const nextMovePositionSize = computed(() => columnWidth.value / 20);
    const xInterval = ref(5);
</script>

<style lang="scss" scoped>
    #vvh {
        border-radius: 1rem;
        border: 0.1rem solid var(--neutralColor);
        padding: 1rem;
        > #title {
            margin: 1rem;
        }
        > #legends {
            margin: 1rem;
            text-align: center;
            > span {
                border-radius: 1rem;
                border: 0.1rem solid var(--primaryColor);
                margin: 1rem;
                padding: 0 0.5rem;
            }
        }
        > #players {
            align-content: normal;
            align-items: center;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: center;
            margin: 1rem;
            text-align: center;
            > b {
                border-radius: 1rem;
                border: 0.1rem solid var(--primaryColor);
                margin: 1rem;
                padding: 0 0.5rem;
            }
        }
        > #top-label,
        #bottom-label {
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
            > #left-label {
                transform: rotate(-90deg);
            }
            > #right-label {
                transform: rotate(90deg);
            }
            > #chart {
                height: 100%;
                width: 100%;
                .draw-symbol,
                .remoteness-coordinate,
                .move-coordinate {
                    fill: var(--primaryColor);
                    font-size: 0.2rem;
                    stroke-width: 0;
                }
                #grid {
                    fill: var(--neutralColor);
                    stroke-width: 0;
                }
                .row-turn- {
                    &1 {
                        fill-opacity: 0.125;
                        fill: var(--turn1Color);
                        stroke-width: 0;
                    }
                    &2 {
                        fill-opacity: 0.125;
                        fill: var(--turn2Color);
                        stroke-width: 0;
                    }
                }
                #remoteness-bar {
                    stroke-width: 0.1;
                    stroke: var(--primaryColor);
                }
                #remoteness-interval-bar {
                    stroke-width: 0.2;
                    stroke: var(--primaryColor);
                }
                .win-color {
                    fill: var(--winColor);
                    stroke: var(--winColor);
                }
                .tie-color {
                    fill: var(--tieColor);
                    stroke: var(--tieColor);
                }
                .draw-color {
                    fill: var(--drawColor);
                    stroke: var(--drawColor);
                }
                .lose-color {
                    fill: var(--loseColor);
                    stroke: var(--loseColor);
                }
                .primary-color {
                    fill: var(--primaryColor);
                    stroke: var(--primaryColor);
                }
            }
        }
        > #meters {
            padding: 1rem 10%;
            > .meter {
                align-content: normal;
                align-items: center;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-between;
                margin: 1rem;
                position: relative;
                * {
                    flex: 1 1 auto;
                }
                > .label {
                    line-height: 1rem;
                    max-width: 30%;
                }
            }
        }
    }
</style>
