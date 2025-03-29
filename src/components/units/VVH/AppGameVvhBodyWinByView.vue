<template>
    <div id="app-game-vvh-body-winbyview">
        <div id="body">
            <!-- Win By Chart -->
            <p id="left-y-axis-label" v-if="toggleGuides && !isPuzzleGame">
                <b>Moves</b>
            </p>
            <svg id="chart" :viewBox="`0 0 ${chartWidth} ${chartHeight}`" xmlns="http://www.w3.org/2000/svg">
                <template v-if="toggleGuides">
                    <text class="left-player-winning-direction" :x="gridLeft" :y="winningDirectionHeight / 2"
                        dominant-baseline="middle" text-anchor="start">
                        |⬅
                        <tspan id="player-1">{{ currentLeftPlayerName }}</tspan>
                        Winning
                    </text>
                    <text class="right-player-winning-direction" :x="gridRight" :y="winningDirectionHeight / 2"
                        dominant-baseline="middle" text-anchor="end">
                        <tspan id="player-2">{{ currentRightPlayerName }}</tspan>
                        Winning ⮕|
                    </text>
                    <text class="left-player-winning-direction" :x="gridLeft" :y="chartHeight - winningDirectionHeight / 2"
                        dominant-baseline="middle" text-anchor="start">
                        |⬅
                        <tspan id="player-1">{{ currentLeftPlayerName }}</tspan>
                        Winning
                    </text>
                    <text class="right-player-winning-direction" :x="gridRight"
                        :y="chartHeight - winningDirectionHeight / 2" dominant-baseline="middle" text-anchor="end">
                        <tspan id="player-2">{{ currentRightPlayerName }}</tspan>
                        Winning ⮕|
                    </text>
                </template>

                <!-- Grid Base -->
                <rect id="grid-base" :x="gridLeft" :y="gridTop" :width="gridWidth" :height="gridHeight" />

                <!-- Round Rows -->
                <template v-if="currentValuedRoundId >= 1">
                    <template v-for="roundNumber in currentValuedRoundId" :key="roundNumber">
                        <rect :class="`turn-${turn(roundNumber)}`" class="round-row" :x="gridLeft"
                            :y="gridTop + (roundNumber - 1) * rowHeight" :width="gridWidth" :height="rowHeight" />
                    </template>
                </template>
                <rect v-if="!isEndOfMatch" :class="`turn-0`" class="round-row" :x="gridLeft" :y="gridBottom - rowHeight"
                    :width="gridWidth" :height="rowHeight" />

                <!-- 0 Labels -->
                <text class="draw-symbol" :x="chartWidth / 2" :y="gridTop - xCoordinateHeight / 2"
                    dominant-baseline="middle" text-anchor="middle">0</text>
                <text class="draw-symbol" :x="chartWidth / 2" :y="gridBottom + xCoordinateHeight / 2"
                    dominant-baseline="middle" text-anchor="middle">0</text>

                <!-- Win By Coordinates -->
                <template v-for="(_, winBy) in (Math.max(5, maximumWinBy) + 1)" :key="winBy">
                    <text class="view-coordinate" v-if="winBy % xInterval === 0"
                        :x="gridLeft + (Math.max(5, maximumWinBy) + 1 - winBy) * columnWidth"
                        :y="gridTop - xCoordinateHeight / 2" dominant-baseline="middle" text-anchor="middle">
                        {{ winBy }}
                    </text>
                    <text class="view-coordinate" v-if="winBy % xInterval === 0"
                        :x="gridRight - (Math.max(5, maximumWinBy) + 1 - winBy) * columnWidth"
                        :y="gridTop - xCoordinateHeight / 2" dominant-baseline="middle" text-anchor="middle">
                        {{ winBy }}
                    </text>
                    <text class="view-coordinate" v-if="winBy % xInterval === 0"
                        :x="gridLeft + (Math.max(5, maximumWinBy) + 1 - winBy) * columnWidth"
                        :y="gridBottom + xCoordinateHeight / 2" dominant-baseline="middle" text-anchor="middle">
                        {{ winBy }}
                    </text>
                    <text class="view-coordinate" v-if="winBy % xInterval === 0"
                        :x="gridRight - (Math.max(5, maximumWinBy) + 1 - winBy) * columnWidth"
                        :y="gridBottom + xCoordinateHeight / 2" dominant-baseline="middle" text-anchor="middle">
                        {{ winBy }}
                    </text>
                </template>
                <!-- Win By Bars -->
                <template v-for="(_, winBy) in Math.max(5, maximumWinBy) + 2" :key="winBy">
                    <line :class="winBy % xInterval !== 0 ?
                        'view-bar' : 'view-interval-bar'" :x1="gridCenter - winBy * columnWidth" :y1="gridTop"
                        :x2="gridCenter - winBy * columnWidth" :y2="gridBottom" :stroke-width="winBy % xInterval !== 0 ?
                            xBarWidth : xIntervalBarWidth" />
                    <line :class="winBy % xInterval !== 0 ?
                        'view-bar' : 'view-interval-bar'" :x1="gridCenter + winBy * columnWidth" :y1="gridTop"
                        :x2="gridCenter + winBy * columnWidth" :y2="gridBottom" :stroke-width="winBy % xInterval !== 0 ?
                            xBarWidth : xIntervalBarWidth" />
                </template>

                <!-- Move Coordinates -->
                <template v-if="currentValuedRoundId >= 2">
                    <template v-for="roundNumber in currentValuedRoundId - 1" :key="roundNumber">
                        <text class="move-coordinate" v-if="currentValuedRounds[roundNumber].firstPlayerTurn"
                            :x="yCoordinateWidth / 2" :y="gridTop + roundNumber * rowHeight - rowHeight / 2"
                            dominant-baseline="middle" text-anchor="middle">
                            {{ currentValuedRounds[roundNumber].move }}
                        </text>
                        <text class="move-coordinate" v-else :x="gridRight + yCoordinateWidth / 2"
                            :y="gridTop + roundNumber * rowHeight - rowHeight / 2" dominant-baseline="middle"
                            text-anchor="middle">
                            {{ currentValuedRounds[roundNumber].move }}
                        </text>
                    </template>

                    <template v-if="isEndOfMatch">
                        <template v-if="isPuzzleGame">
                            <text class="move-coordinate" :x="gridRight + yCoordinateWidth / 2"
                                :y="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2" dominant-baseline="middle"
                                text-anchor="middle">
                                🥳
                            </text>
                        </template>
                        <template v-else-if="currentPositionValue === 'tie'">
                            <text class="move-coordinate" :x="yCoordinateWidth / 2"
                                :y="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2" dominant-baseline="middle"
                                text-anchor="middle">
                                🤔
                            </text>
                            <text class="move-coordinate" :x="gridRight + yCoordinateWidth / 2"
                                :y="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2" dominant-baseline="middle"
                                text-anchor="middle">
                                🤔
                            </text>
                        </template>
                        <template v-else>
                            <text class="move-coordinate" :x="yCoordinateWidth / 2"
                                :y="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2" dominant-baseline="middle"
                                text-anchor="middle"> {{
                                    (currentFirstPlayerTurn && currentPositionValue === "win") ||
                                    (!currentFirstPlayerTurn && currentPositionValue === "lose") ?
                                    "🥳" : "😢"
                                }} </text>
                            <text class="move-coordinate" :x="gridRight + yCoordinateWidth / 2"
                                :y="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2" dominant-baseline="middle"
                                text-anchor="middle"> {{
                                    (!currentFirstPlayerTurn && currentPositionValue === "win") ||
                                    (currentFirstPlayerTurn && currentPositionValue === "lose") ?
                                    "🥳" : "😢"
                                }}</text>
                        </template>
                    </template>
                </template>

                <!-- Position Value Links -->
                <template v-if="currentValuedRoundId >= 2">
                    <template v-for="roundNumber in currentValuedRoundId - 1" :key="roundNumber">
                        <line :class="`${currentValuedRounds[roundNumber].moveValue} link`"
                            :x1="winByNodeGridXPosition(roundNumber)"
                            :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                            :x2="winByNodeGridXPosition(roundNumber + 1)"
                            :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2" :stroke-width="linkWidth" />
                    </template>
                </template>

                <!-- Link from Current Position Value to Next Moves' Position Value -->
                <template v-if="showNextMoves && currentValuedRounds[currentValuedRoundId]">
                    <template v-for="nextMove in currentValuedRounds[currentValuedRoundId].position.availableMoves"
                        :key="nextMove">
                        <line :class="`${nextMove.moveValue} link`" :x1="winByNodeGridXPosition(currentValuedRoundId)"
                            :y1="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                            :x2="winByNextNodeGridXPosition(currentValuedRoundId, nextMove)"
                            :y2="gridTop + currentValuedRoundId * rowHeight + rowHeight / 2" :stroke-width="linkWidth" />
                    </template>
                </template>

                <!-- Move Nodes -->
                <template v-if="showNextMoves && currentValuedRoundId >= 1">
                    <template v-for="roundNumber in currentValuedRoundId" :key="roundNumber">
                        <template v-for="nextMove in surfaceHighlightedMoveInMoves(highlightedMove, currentValuedRounds[roundNumber].position.availableMoves)"
                            :key="nextMove.move">
                            <circle
                                :class="[roundNumber === currentValuedRoundId ? 'clickable' : '', showNextMoveHints ? nextMove.positionValue : '', (roundNumber == currentRoundId && highlightedMove === nextMove.move) ? 'highlighted' : '']"
                                class="next-move-position-value" :cx="winByNextNodeGridXPosition(roundNumber, nextMove)"
                                :cy="gridTop + roundNumber * rowHeight + rowHeight / 2" :r="nextMovePositionValueSize"
                                :stroke-width="4 * nextMovePositionValueSize"
                                @click="roundNumber === currentValuedRoundId &&
                                    store.dispatch(actionTypes.runMove, { move: nextMove.move })"
                                @mouseover="roundNumber == currentRoundId && store.commit(mutationTypes.setHighlightedMove, nextMove.move)"
                                @mouseout="roundNumber == currentRoundId && store.commit(mutationTypes.setHighlightedMove, '')"/>
                        </template>
                    </template>
                </template>

                <!-- Position Nodes -->
                <template v-if="currentValuedRoundId">
                    <template v-for="roundNumber in currentValuedRoundId" :key="roundNumber">
                        <circle
                            :class="[roundNumber !== currentValuedRoundId ? 'clickable' : '', currentValuedRounds[roundNumber].position.positionValue]"
                            class="position-value" :cx="winByNodeGridXPosition(roundNumber)"
                            :cy="gridTop + roundNumber * rowHeight - rowHeight / 2" :r="positionValueSize"
                            :stroke-width="4 * positionValueSize" @click="roundNumber !== currentValuedRoundId &&
                                store.dispatch(actionTypes.undoMove, {
                                    toRoundId: currentValuedRounds[roundNumber].id
                                })" />
                    </template>
                </template>
            </svg>
            <p id="right-y-axis-label" v-if="toggleGuides">
                <b>Moves</b>
            </p>
        </div>
        <div id="meters" v-if="toggleOptions">
            <div class="meter">
                <p class="label">View Coordinate Height</p>
                <VueSlider v-model="xCoordinateHeight" :min="1" :max="50" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Coordinate Width</p>
                <VueSlider v-model="yCoordinateWidth" :min="1" :max="50" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Row Height</p>
                <VueSlider v-model="rowHeight" :min="1" :max="50" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Chart Width</p>
                <VueSlider v-model="chartWidth" :min="1" :max="500" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Position Value Size</p>
                <VueSlider v-model="positionValueSize" :min="0.1" :max="5" :interval="0.1" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Next Move Position Value Size</p>
                <VueSlider v-model="nextMovePositionValueSize" :min="0.1" :max="5" :interval="0.1" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Link Width</p>
                <VueSlider v-model="linkWidth" :min="0.1" :max="5" :interval="0.1" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Bar Width</p>
                <VueSlider v-model="xBarWidth" :min="0.1" :max="5" :interval="0.1" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Interval Bar Width</p>
                <VueSlider v-model="xIntervalBarWidth" :min="0.1" :max="5" :interval="0.1" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">View Interval</p>
                <VueSlider v-model="xInterval" :min="1" :max="maximumWinBy" :tooltip="'active'" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref } from "vue";
    import { mutationTypes, actionTypes, useStore } from "../../../scripts/plugins/store";
    import { Moves, Move, Rounds } from "../../../scripts/gamesmanUni/types";
    import * as Remoteness from "../../../scripts/gamesmanUni/remoteness";
    import VueSlider from "vue-slider-component";
    import "vue-slider-component/theme/default.css";

    defineProps({
        toggleOptions: Boolean,
        toggleScrolling: Boolean,
        toggleGuides: Boolean,
    });

    const store = useStore();
    const options = computed(() => store.getters.options);
    const showNextMoves = computed(() => (options.value ? options.value.showNextMoves : true));
    const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));

    const isPuzzleGame = computed(() => store.getters.currentGameType === "puzzles");

    const currentLeftPlayerName = computed(() => (store.getters.currentLeftPlayer ? store.getters.currentLeftPlayer.name : ""));
    const currentRightPlayerName = computed(() => (store.getters.currentRightPlayer ? store.getters.currentRightPlayer.name : ""));
    const currentRoundId = computed(() => store.getters.currentRoundId);
    const currentPositionValue = computed(() => store.getters.currentPositionValue);
    const currentRounds = computed(() => store.getters.currentRounds);

    const maximumRemoteness = computed(() => store.getters.maximumRemoteness(1, store.getters.currentRoundId));
    
    /** 
     * Iterate through the rounds and see if any visited positions or any child positions of
     * any visited positions have a finite unknown remoteness (FUR). If so, set their remoteness
     * to be a dummy value of 1 greater than the maximum known finite remoteness,
     * which is where on the VVH finite unknown remoteness positions will go.
     * @returns [0]: A copy of the match's rounds, with the remotenesses of FUR positions set to max known remoteness + 1
     * @returns [1]: A boolean indicating whether there are FUR positions.
    */
    const detectFiniteUnknownRemoteness = computed((): [Rounds, boolean] => {
        var roundsCopy = JSON.parse(JSON.stringify(currentRounds.value)) as Rounds;
        var finiteUnknownRemotenessExists = false;
        for (const round of roundsCopy) {
            if (round.position.positionValue !== "unsolved") {
                if (round.position.remoteness == Remoteness.FINITE_UNKNOWN) {
                    round.position.remoteness = maximumRemoteness.value + 1;
                    finiteUnknownRemotenessExists = true;
                }
                for (const move in round.position.availableMoves) {
                    const moveObj = round.position.availableMoves[move]
                    if (moveObj.remoteness == Remoteness.FINITE_UNKNOWN) {
                        moveObj.remoteness = maximumRemoteness.value + 1;
                        finiteUnknownRemotenessExists = true;
                    }
                }
            }
        }
        return [roundsCopy.filter(round => round.position.positionValue !== "unsolved"), finiteUnknownRemotenessExists];
    });
    const currentValuedRounds = computed(() => detectFiniteUnknownRemoteness.value[0]);
    const currentValuedRoundId = computed(() =>
        Math.max(0, currentRoundId.value - currentRounds.value.length + currentValuedRounds.value.length)
    );
    const currentFirstPlayerTurn = computed(() => store.getters.currentMatch.round.firstPlayerTurn);
    const isEndOfMatch = computed(() => store.getters.isEndOfMatch);

    const winningDirectionHeight = ref(2);
    const xCoordinateHeight = ref(2);
    const rowHeight = ref(2);
    const rowCount = computed(() => (isEndOfMatch.value ? currentValuedRoundId.value : currentValuedRoundId.value + 1));
    const gridTop = computed(() => winningDirectionHeight.value + xCoordinateHeight.value);
    const gridHeight = computed(() => rowHeight.value * rowCount.value);
    const chartHeight = computed(() => 2 * gridTop.value + gridHeight.value);
    const gridBottom = computed(() => chartHeight.value - gridTop.value);

    const yCoordinateWidth = ref(5);
    const chartWidth = ref(50);
    const columnCount = computed(() => (isPuzzleGame.value ? 1 : 2) * (Math.max(5, maximumWinBy.value) + 1));
    const gridWidth = computed(() => chartWidth.value - 2 * yCoordinateWidth.value);
    const columnWidth = computed(() => gridWidth.value / columnCount.value);
    const gridLeft = computed(() => yCoordinateWidth.value);
    const gridRight = computed(() => chartWidth.value - gridLeft.value);
    const gridCenter = computed(() => chartWidth.value / 2)

    const positionValueSize = ref(0.2);
    const nextMovePositionValueSize = ref(0.1);
    const xInterval = ref(5);
    const linkWidth = ref(0.2);
    const xBarWidth = ref(0.1);
    const xIntervalBarWidth = ref(0.2);

    /** 
     * Determines whether it is the first player's turn or the second player's turn based on the current round id.
     * @param {number} roundID - current round id.
     * @returns 1 when it is the first player's turn, 2 when it is the second player's turn.
    */
    const turn = (roundID: number) => {
        return currentValuedRounds.value[roundID].firstPlayerTurn ? 1 : 2;
    };

    /** 
     * Determines whether it will be the first player's turn or the second player's turn on the next turn based on the current round id.
     * @param {number} roundID - current round id.
     * @returns 1 when it is the first player's turn, 2 when it is the second player's turn.
    */
    const nextTurn = (roundID: number) => {
        return currentValuedRounds.value[roundID].firstPlayerTurn ? 2 : 1;
    }

    // Stores the maximum between the maximum 'Win By' value or the default value.
    const maximumWinBy = computed(() => store.getters.maximumWinBy(1, store.getters.currentRoundId));

    /** 
     * Determines the x-position of the current position's node in the 'Win By' view of the Visual Value History (VVH) graph.
     * @param {number} roundID - current round id.
     * @returns x position in the Graph's grid.
    */
    const winByNodeGridXPosition = (roundID: number) => {
        // Left Nodes: When its the first players turn (at that move) and is winning, or, its not the first players turn (at that move) and is loosing
        if ((currentValuedRounds.value[roundID].firstPlayerTurn && currentValuedRounds.value[roundID].position.positionValue === 'win')
            || (!currentValuedRounds.value[roundID].firstPlayerTurn && currentValuedRounds.value[roundID].position.positionValue === 'lose')
        ) {
            return gridCenter.value - currentValuedRounds.value[roundID].position.winby * columnWidth.value;
            // Right Nodes: When its the first players turn (at that move) and is loosing, or, its not the first players (at that move) turn and is winning
        } else if ((currentValuedRounds.value[roundID].firstPlayerTurn && currentValuedRounds.value[roundID].position.positionValue === 'lose')
            || (!currentValuedRounds.value[roundID].firstPlayerTurn && currentValuedRounds.value[roundID].position.positionValue === 'win')
        ) {
            return gridCenter.value + currentValuedRounds.value[roundID].position.winby * columnWidth.value;
            // Tie & Draw Nodes
        } else {
            return gridCenter.value;
        }
    }

    /** 
     * Determines the x-position of the next move's node in the 'Win By' view of the Visual Value History (VVH) graph.
     * @param {number} roundID - current round id.
     * @param {Move} nextMove - a next move of the current position.
     * @returns x position in the Graph's grid.
    */
    const winByNextNodeGridXPosition = (roundID: number, nextMove: Move) => {
        // Left Nodes: When its the first players turn (at that move) and is winning, or, its not the first players turn (at that move) and is loosing
        if ((nextTurn(roundID) === 1 && nextMove.positionValue === 'win')
            || (nextTurn(roundID) === 2 && nextMove.positionValue === 'lose')
        ) {
            return gridCenter.value - nextMove.winby * columnWidth.value;
            // Right Nodes: When its the first players turn (at that move) and is loosing, or, its not the first players (at that move) turn and is winning
        } else if ((nextTurn(roundID) === 1 && nextMove.positionValue === 'lose')
            || (nextTurn(roundID) === 2 && nextMove.positionValue === 'win')
        ) {
            return gridCenter.value + nextMove.winby * columnWidth.value;
            // Tie & Draw Nodes
        } else {
            return gridCenter.value;
        }
    }

    const highlightedMove = computed(() => store.getters.currentHighlightedMove);

    /**
     * 'Surfaces' the highlighted move 'highlightedMove' in the Moves (Record<string, Move>) 'moves'. Given the 
     * last move rendered is the move rendered on top, to 'surface' the highlighted move refers to placing the 
     * move as the last entry in the Record.
     * @param {string} highlightedMove - highlighted move name as a string, if no move is highlighted
     * then highlightedMove must be an empty string "".
     * @param {Moves} moves
     * @returns non-modified available moves if highlightedMove is an empty string--- If it is not empty,
     * returns the available moves with the highlighted move last.
     */
     const surfaceHighlightedMoveInMoves = (highlightedMove: string, moves: Moves) => {
        if (highlightedMove === "" || !moves.hasOwnProperty(highlightedMove)) {
            return moves;
        }

        const { [highlightedMove]: highlighted, ...restMoves } = moves;
        return { ...restMoves, [highlightedMove]: highlighted };
    }
</script>

<style lang="scss" scoped>
    #app-game-vvh-body-winbyview {

        >#color-guides {
            margin: 1rem;
            text-align: center;

            >.color {
                border-radius: 1rem;
                margin: 1rem;
                padding: 0.25rem 0.5rem;
            }
        }

        >.x-axis-label {
            text-align: center;
        }

        >#body {
            align-content: normal;
            align-items: center;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: center;

            >* {
                flex: 1 1 auto;
            }

            >#left-y-axis-label {
                text-align: center;
                transform: rotate(-90deg);
            }

            >#chart {

                >.player-winning-direction,
                >.left-player-winning-direction,
                >.right-player-winning-direction {
                    fill: var(--primaryColor);
                    font-size: 0.07rem;
                    font-weight: 400;

                    >#player,
                    >#player-1 {
                        fill: var(--turn1Color);
                        font-size: 0.07rem;
                        font-weight: 400;
                    }

                    >#player-2 {
                        fill: var(--turn2Color);
                        font-size: 0.07rem;
                        font-weight: 400;
                    }
                }

                >.draw-symbol {
                    fill: var(--primaryColor);
                    font-size: 0.07rem;
                }

                >.view-coordinate {
                    fill: var(--primaryColor);
                    font-size: 0.07rem;
                }

                >.move-coordinate {
                    fill: var(--primaryColor);
                    font-size: 0.07rem;
                }

                >#grid-base {
                    fill: white;
                }

                >.round-row {
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

                >.view-bar,
                >.view-interval-bar {
                    stroke: black;
                }

                >.position-value,
                >.next-move-position-value {
                    &.clickable:hover {
                        cursor: pointer;
                    }
                }

                >.position-value,
                >.next-move-position-value,
                >.link {
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

                    &.highlighted {
                        fill: var(--moveHighlightColor);
                        stroke: var(--moveHighlightColor);
                    }
                }
            }

            >#right-y-axis-label {
                text-align: center;
                transform: rotate(90deg);
            }
        }
    }

    #meters {
        padding: 1rem 10%;

        >.meter {
            align-content: normal;
            align-items: center;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-between;
            padding: 0.5rem;
            position: relative;

            >* {
                flex: 1 1 auto;
            }

            >.label {
                line-height: 1rem;
                max-width: 30%;
                text-align: left;
            }
        }
    }
</style>