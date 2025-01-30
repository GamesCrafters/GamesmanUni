<template>
    <div id="app-game-vvh-body-winbyview">
        <div id="body">
            <!-- Win By Chart -->
            <p id="left-y-axis-label" v-if="toggleGuides && !isPuzzleGame">
                <b>Moves</b>
            </p>
            <svg id="chart" :viewBox="`0 0 ${chartWidth} ${chartHeight}`" xmlns="http://www.w3.org/2000/svg">
                <template v-if="toggleGuides">
                    <text class="left-player-winning-direction"
                        :x="gridLeft"
                        :y="winningDirectionHeight / 2"
                        dominant-baseline="middle" text-anchor="start">
                        |⬅
                        <tspan id="player-1">{{ currentLeftPlayerName }}</tspan>
                        Winning
                    </text>
                    <text class="right-player-winning-direction"
                        :x="gridRight"
                        :y="winningDirectionHeight / 2"
                        dominant-baseline="middle" text-anchor="end">
                        <tspan id="player-2">{{ currentRightPlayerName }}</tspan>
                        Winning ⮕|
                    </text>
                    <text class="left-player-winning-direction"
                        :x="gridLeft"
                        :y="chartHeight - winningDirectionHeight / 2"
                        dominant-baseline="middle" text-anchor="start">
                        |⬅
                        <tspan id="player-1">{{ currentLeftPlayerName }}</tspan>
                        Winning
                    </text>
                    <text class="right-player-winning-direction"
                        :x="gridRight"
                        :y="chartHeight - winningDirectionHeight / 2"
                        dominant-baseline="middle" text-anchor="end">
                        <tspan id="player-2">{{ currentRightPlayerName }}</tspan>
                        Winning ⮕|
                    </text>
                </template>

                <!-- Grid Base -->
                <rect id="grid-base" :x="gridLeft" :y="gridTop" :width="gridWidth" :height="gridHeight" />

                <!-- Round Rows -->
                <template v-if="currentValuedRoundId >= 1">
                    <template v-for="roundNumber in currentValuedRoundId" :key="roundNumber">
                        <!-- Regular Round Row -->
                        <rect :class="`turn-${turn(roundNumber)}`" class="round-row"
                            :x="gridLeft"
                            :y="gridTop + (roundNumber - 1) * rowHeight + roundYOffset(roundNumber)"
                            :width="gridWidth" :height="rowHeight" />
                    </template>
                </template>

                <rect v-if="!isEndOfMatch" :class="`turn-0`" class="round-row"
                    :x="gridLeft"
                    :y="gridBottom - rowHeight + roundYOffset(currentValuedRoundId)"
                    :width="gridWidth" :height="rowHeight" />

                <!-- 0 Labels -->
                <text class="draw-symbol"
                    :x="chartWidth / 2"
                    :y="gridTop - xCoordinateHeight / 2"
                    dominant-baseline="middle" text-anchor="middle">ND/NPD*</text>
                <text class="draw-symbol"
                    :x="chartWidth / 2"
                    :y="gridBottom + xCoordinateHeight / 2 + roundYOffset(currentValuedRoundId)"
                    dominant-baseline="middle" text-anchor="middle">ND/NPD*</text>

                <!-- Draw Remoteness Coordinates -->
                <template v-for="(_, drawRemoteness) in Math.max(0, maximumDrawLevelRemoteness) + 1"
                        :key="drawRemoteness">
                    <text class="view-coordinate"
                            v-if="!isPuzzleGame && drawRemoteness % xInterval === 0"
                            :x="gridLeft + drawRemoteness * columnWidth"
                            :y="gridTop - xCoordinateHeight / 2"
                            dominant-baseline="middle"
                            text-anchor="middle">
                        {{ drawRemoteness }}
                    </text>
                    <text class="view-coordinate"
                            v-if="drawRemoteness % xInterval === 0"
                            :x="gridRight - drawRemoteness * columnWidth"
                            :y="gridTop - xCoordinateHeight / 2"
                            dominant-baseline="middle"
                            text-anchor="middle">
                        {{ drawRemoteness }}
                    </text>
                    <text class="view-coordinate"
                            v-if="!isPuzzleGame && drawRemoteness % xInterval === 0"
                            :x="gridLeft + drawRemoteness * columnWidth"
                            :y="gridBottom + xCoordinateHeight / 2 + roundYOffset(currentValuedRoundId)"
                            dominant-baseline="middle"
                            text-anchor="middle">
                        {{ drawRemoteness }}
                    </text>
                    <text class="view-coordinate"
                            v-if="drawRemoteness % xInterval === 0"
                            :x="gridRight - drawRemoteness * columnWidth"
                            :y="gridBottom + xCoordinateHeight / 2 + roundYOffset(currentValuedRoundId)"
                            dominant-baseline="middle"
                            text-anchor="middle">
                        {{ drawRemoteness }}
                    </text>
                </template>

                <!-- Draw Level Bars -->
                <template v-for="(_, drawRemoteness) in Math.max(0, maximumDrawLevelRemoteness) + 2" :key="drawRemoteness">
                    <line v-if="!isPuzzleGame"
                        :class="drawRemoteness % xInterval !== 0 && drawRemoteness < Math.max(0, maximumDrawLevelRemoteness) + 1 ?
                            'view-bar' : 'view-interval-bar'"
                        :x1="gridLeft + drawRemoteness * columnWidth"
                        :y1="gridTop"
                        :x2="gridLeft + drawRemoteness * columnWidth"
                        :y2="gridBottom + roundYOffset(currentValuedRoundId)"
                        :stroke-width="drawRemoteness % xInterval !== 0 && drawRemoteness < Math.max(0, maximumDrawLevelRemoteness) + 1 ?
                            xBarWidth : xIntervalBarWidth" />
                    <line :class="drawRemoteness % xInterval !== 0 && drawRemoteness < Math.max(0, maximumDrawLevelRemoteness) + 1 ?
                              'view-bar' : 'view-interval-bar'"
                          :x1="gridRight - drawRemoteness * columnWidth"
                          :y1="gridTop"
                          :x2="gridRight - drawRemoteness * columnWidth"
                          :y2="gridBottom + roundYOffset(currentValuedRoundId)"
                          :stroke-width="drawRemoteness % xInterval !== 0 && drawRemoteness < Math.max(0, maximumDrawLevelRemoteness) + 1 ?
                              xBarWidth : xIntervalBarWidth" />
                </template>
                
                <!-- Move Coordinates -->
                <template v-if="currentValuedRoundId >= 2">
                    <template v-for="roundNumber in currentValuedRoundId - 1" :key="roundNumber">
                        <text class="move-coordinate" v-if="currentValuedRounds[roundNumber].firstPlayerTurn"
                            :x="yCoordinateWidth / 2"
                            :y="gridTop + roundNumber * rowHeight - rowHeight / 2 + roundYOffset(roundNumber)"
                            dominant-baseline="middle" text-anchor="middle">
                            {{ currentValuedRounds[roundNumber].move }}
                        </text>
                        <text class="move-coordinate" v-else :x="gridRight + yCoordinateWidth / 2"
                            :y="gridTop + roundNumber * rowHeight - rowHeight / 2 + roundYOffset(roundNumber)"
                            dominant-baseline="middle"
                            text-anchor="middle">
                            {{ currentValuedRounds[roundNumber].move }}
                        </text>
                    </template>

                    <template v-if="isEndOfMatch">
                        <template v-if="isPuzzleGame">
                            <text class="move-coordinate"
                                :x="gridRight + yCoordinateWidth / 2"
                                :y="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                dominant-baseline="middle"
                                text-anchor="middle">
                                🥳
                            </text>
                        </template>
                        <template v-else-if="currentPositionValue === 'tie'">
                            <text class="move-coordinate"
                                :x="yCoordinateWidth / 2"
                                :y="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2 + roundYOffset(currentValuedRoundId)"
                                dominant-baseline="middle"
                                text-anchor="middle">
                                🤔
                            </text>
                            <text class="move-coordinate"
                                :x="gridRight + yCoordinateWidth / 2"
                                :y="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2 + roundYOffset(currentValuedRoundId)"
                                dominant-baseline="middle"
                                text-anchor="middle">
                                🤔
                            </text>
                        </template>
                        <template v-else>
                            <text class="move-coordinate"
                                :x="yCoordinateWidth / 2"
                                :y="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2 + roundYOffset(currentValuedRoundId)"
                                dominant-baseline="middle"
                                text-anchor="middle"> {{
                                    (currentFirstPlayerTurn && currentPositionValue === "win") ||
                                    (!currentFirstPlayerTurn && currentPositionValue === "lose") ?
                                    "🥳" : "😢"
                                }} </text>
                            <text class="move-coordinate"
                                :x="gridRight + yCoordinateWidth / 2"
                                :y="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2 + roundYOffset(currentValuedRoundId)"
                                dominant-baseline="middle"
                                text-anchor="middle"> {{
                                    (!currentFirstPlayerTurn && currentPositionValue === "win") ||
                                    (currentFirstPlayerTurn && currentPositionValue === "lose") ?
                                    "🥳" : "😢"
                                }}</text>
                        </template>
                    </template>
                </template>

                <!-- Initial Draw Fringe -->
                <template v-if="isPureDraw(1)">
                    <!-- Regular Round Row -->
                    <rect 
                        :class="'fringe-row'"
                        :x="gridLeft + 0.5"
                        :y="gridTop + 0.5"
                        :width="gridWidth - 1" 
                        :height="fringeOffset - 1" />
                    <text
                        class="fringe-row-heading"
                        :x="gridLeft + (gridWidth / 2)"
                        :y="gridTop + (fringeOffset / 2)"
                        fill="white"
                        dominant-baseline="middle"
                        text-anchor="middle"
                    >
                        Draw Level {{ maximumDrawLevel }}
                    </text>
                </template>

                <!-- Fringe Rows -->
                <template v-if="currentValuedRoundId >= 1">
                    <template v-for="roundNumber in currentValuedRoundId" :key="roundNumber">
                        <template v-if="isNewDrawLevel(roundNumber)">
                            <rect 
                                :class="'fringe-row'"
                                :x="gridLeft + 0.5"
                                :y="gridTop + (roundNumber - 1) * rowHeight + roundYOffset(roundNumber - 1) + 0.5"
                                :width="gridWidth - 1" 
                                :height="fringeOffset - 1" />
                            <text
                                class="fringe-row-heading"
                                :x="gridLeft + (gridWidth / 2)"
                                :y="gridTop + (roundNumber - 1) * rowHeight + roundYOffset(roundNumber - 1) + (fringeOffset / 2)"
                                fill="white"
                                dominant-baseline="middle"
                                text-anchor="middle"
                            >
                                Draw Level {{ roundDrawLevel(roundNumber) }}
                            </text>
                        </template>
                    </template>
                </template>

                <!-- Position Value Links -->
                <template v-if="currentValuedRoundId >= 2">
                    <template v-for="roundNumber in currentValuedRoundId - 1" :key="roundNumber">
                        <line :class="`${currentValuedRounds[roundNumber].moveValue} link`"
                            :x1="drawLevelNodeGridXPosition(roundNumber)"
                            :y1="gridTop + roundNumber * rowHeight - rowHeight / 2 + roundYOffset(roundNumber)"
                            :x2="drawLevelNodeGridXPosition(roundNumber + 1)"
                            :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2 + roundYOffset(roundNumber + 1)"
                            :stroke-width="linkWidth" />
                    </template>
                </template>

                <!-- Link from Current Position Value to Next Moves' Position Value -->
                <template v-if="showNextMoves && currentValuedRounds[currentValuedRoundId]">
                    <template v-for="nextMove in currentValuedRounds[currentValuedRoundId].position.availableMoves"
                        :key="nextMove">
                        <line :class="`${nextMove.moveValue} link`"
                            :x1="drawLevelNodeGridXPosition(currentValuedRoundId)"
                            :y1="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2 + roundYOffset(currentValuedRoundId)"
                            :x2="drawLevelNextNodeGridXPosition(currentValuedRoundId, nextMove)"
                            :y2="gridTop + currentValuedRoundId * rowHeight + rowHeight / 2 + roundYOffset(currentValuedRoundId)"
                            :stroke-width="linkWidth" />
                    </template>
                </template>

                <!-- Move Nodes -->
                <template v-if="showNextMoves && currentValuedRoundId >= 1">
                    <template v-for="roundNumber in currentValuedRoundId" :key="roundNumber">
                        <template v-for="nextMove in currentValuedRounds[roundNumber].position.availableMoves"
                            :key="nextMove.move">
                            <circle
                                :class="[roundNumber === currentValuedRoundId ? 'clickable' : '', showNextMoveHints ? nextMove.positionValue : '', 'drawLevel' in nextMove ? (nextMove.drawRemoteness % 2 == 0 ? 'draw-lose' : 'draw-win') : '']"
                                class="next-move-position-value"
                                :cx="drawLevelNextNodeGridXPosition(roundNumber, nextMove)"
                                :cy="gridTop + roundNumber * rowHeight + rowHeight / 2 + roundMoveYOffset(roundNumber, nextMove)"
                                :r="nextMovePositionValueSize"
                                :stroke-width="nextMovePositionValueStrokeSize"
                                @click="roundNumber === currentValuedRoundId &&
                                    store.dispatch(actionTypes.runMove, { move: nextMove.move })" />
                        </template>
                    </template>
                </template>

                <!-- Position Nodes -->
                <template v-if="currentValuedRoundId">
                    <template v-for="roundNumber in currentValuedRoundId" :key="roundNumber">
                        <circle
                            :class="[roundNumber !== currentValuedRoundId ? 'clickable' : '', currentValuedRounds[roundNumber].position.positionValue, currentValuedRounds[roundNumber].position.drawRemoteness > -1 ? (currentValuedRounds[roundNumber].position.drawRemoteness % 2 == 0 ? 'draw-lose' : 'draw-win') : '']"
                            class="position-value"
                            :cx="drawLevelNodeGridXPosition(roundNumber)"
                            :cy="gridTop + roundNumber * rowHeight - rowHeight / 2 + roundYOffset(roundNumber)"
                            :r="positionValueSize"
                            :stroke-width="positionValueStrokeSize"
                            @click="roundNumber !== currentValuedRoundId &&
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
                <p class="label">Fringe Height</p>
                <VueSlider v-model="fringeOffset" :min="2" :max="50" :tooltip="'active'" />
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
                <p class="label">Position Value Stroke Size</p>
                <VueSlider v-model="positionValueStrokeSize" :min="0.1" :max="5" :interval="0.1" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Next Move Position Value Size</p>
                <VueSlider v-model="nextMovePositionValueSize" :min="0.1" :max="5" :interval="0.1" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Next Move Position Value Stroke Size</p>
                <VueSlider v-model="nextMovePositionValueStrokeSize" :min="0.1" :max="5" :interval="0.1" :tooltip="'active'" />
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
                <VueSlider v-model="xInterval" :min="1" :max="maximumDrawLevelRemoteness" :tooltip="'active'" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref } from "vue";
    import { actionTypes, useStore } from "../../../scripts/plugins/store";
    import { Move, Rounds } from "../../../scripts/gamesmanUni/types";
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
    const maximumDrawLevel = computed(() => store.getters.maximumDrawLevel(1, store.getters.currentRoundId));
    
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

    const gridHeight = computed(() => rowHeight.value * rowCount.value + roundYOffset(currentValuedRoundId.value));

    const chartHeight = computed(() => 2 * gridTop.value + gridHeight.value);
    const gridBottom = computed(() => chartHeight.value - gridTop.value - roundYOffset(currentValuedRoundId.value));


    const yCoordinateWidth = ref(5);
    const chartWidth = ref(50);
    const columnCount = computed(() => (isPuzzleGame.value ? 1 : 2) * (Math.max(5, maximumDrawLevelRemoteness.value) + 1));
    const gridWidth = computed(() => chartWidth.value - 2 * yCoordinateWidth.value);
    const columnWidth = computed(() => gridWidth.value / columnCount.value);
    const gridLeft = computed(() => yCoordinateWidth.value);
    const gridRight = computed(() => chartWidth.value - gridLeft.value);
    const gridCenter = computed(() => chartWidth.value / 2)

    // Node radius
    const positionValueSize = ref(0.6);
    // Node stroke
    const positionValueStrokeSize = ref(0.2);
    // Move node radius
    const nextMovePositionValueSize = ref(0.3);
    // Move node stroke
    const nextMovePositionValueStrokeSize = ref(0.1);
    
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

    // Stores the maximum between the maximum Draw Level Remoteness value or the default value.
    const maximumDrawLevelRemoteness = computed(() => store.getters.maximumDrawLevelRemoteness(1, store.getters.currentRoundId));

    /** 
     * Determines the x-position of the current position's node in the 'Win By' view of the Visual Value History (VVH) graph.
     * @param {number} roundID - current round id.
     * @returns x position in the Graph's grid.
    */
    const drawLevelNodeGridXPosition = (roundID: number) => {
        const round = currentValuedRounds.value[roundID];
        const position = round.position;
        const isFirstPlayerTurn = round.firstPlayerTurn;
        const drawRemoteness = position.drawRemoteness;
        const drawValue = drawRemoteness % 2 == 0 ? "lose": "win";
        
        // Center: Non-Pure Draws & Non-Draw Nodes
        if (drawRemoteness === -1) {
            return gridCenter.value;
        }

        // Left Hand Side: When its the first players turn (at that move) and is at a draw-win, or, its not the first players turn (at that move) and is at a draw-lose
        const isLHS = (isFirstPlayerTurn && drawValue === 'win') || (!isFirstPlayerTurn && drawValue === 'lose');
        return isLHS ? gridLeft.value + drawRemoteness * columnWidth.value : gridRight.value - drawRemoteness * columnWidth.value;
        
    }

    /** 
     * Determines the x-position of the next move's node in the 'Win By' view of the Visual Value History (VVH) graph.
     * @param {number} roundID - current round id.
     * @param {Move} nextMove - a next move of the current position.
     * @returns x position in the Graph's grid.
    */
    const drawLevelNextNodeGridXPosition = (roundID: number, nextMove: Move) => {
        const nextDrawRemoteness = nextMove.drawRemoteness;
        const nextDrawValue = nextDrawRemoteness % 2 == 0 ? "lose": "win";
        const isFirstPlayerNextTurn = nextTurn(roundID) === 1;
        
        // Center: Non-Pure Draws & Non-Draw Nodes
        if (nextDrawRemoteness === undefined) {
            return gridCenter.value;
        }

        // Left Hand Side: When its the first players turn (at that move) and is at a draw-win, or, its not the first players turn (at that move) and is at a draw-lose
        const isLHS = (isFirstPlayerNextTurn && nextDrawValue === 'win') || (!isFirstPlayerNextTurn && nextDrawValue === 'lose');
        return isLHS ? gridLeft.value + nextDrawRemoteness * columnWidth.value : gridRight.value - nextDrawRemoteness * columnWidth.value;
    }

    /** 
     * Determines if the game reached a new draw level in the 'Draw Level' view of the Visual Value History (VVH) graph.
     * @param {number} roundID - current round id.
     * @returns true if game reached a new draw level.
    */
    const isNewDrawLevel = (roundID: number) => {
        const prevPosition = currentValuedRounds.value[roundID - 1].position;
        const position = currentValuedRounds.value[roundID].position;
        const prevDrawLevel = prevPosition.drawLevel;
        const drawLevel = position.drawLevel;

        // Non-Pure Draws & Non-Draw Nodes can't reach a new draw level
        if (prevDrawLevel === -1 || drawLevel === -1) {
            return false;
        }
        
        return prevDrawLevel === drawLevel + 1;
    }

    const fringeOffset = ref(2);

    /** 
     * Determines the vertical offset for rows given the previous new draw levels in the 'Draw Level' view of the Visual Value History (VVH) graph.
     * @param {number} roundID - current round id.
     * @returns y-offset in the Graph's grid.
    */
    const roundYOffset = (roundID: number) => {
        const position = currentValuedRounds.value[roundID] ? currentValuedRounds.value[roundID].position : null;
        const drawLevel = position ? position.drawLevel : -1;
        
        // Non-Pure Draws & Non-Draw Nodes can't reach a new draw level
        if (drawLevel === -1) {
            return (maximumDrawLevel.value + Number(isPureDraw(1))) * fringeOffset.value;
        }
        
        return (maximumDrawLevel.value - drawLevel + Number(isPureDraw(1))) * fringeOffset.value;
    }

    /** 
     * Determines the vertical offset for rows given the previous new draw levels in the 'Draw Level' view of the Visual Value History (VVH) graph.
     * @param {number} roundID - current round id.
     * @param {Move} nextMove - a next move of the current position.
     * @returns y-offset in the Graph's grid.
    */
    const roundMoveYOffset = (roundID: number, nextMove: Move) => {
        const position = currentValuedRounds.value[roundID].position;
        const nextMovedrawLevel = nextMove.drawLevel;
        const drawLevel = position.drawLevel;

        // Non-Pure Draws & Non-Draw Nodes can't reach a new draw level
        if (nextMovedrawLevel === undefined || drawLevel === -1) {
            return (maximumDrawLevel.value + Number(isPureDraw(1))) * fringeOffset.value;
        }

        // Since roundMoveYOffset is called for all moves, including the next moves available, we must account
        // for the fact that the next moves available can't access their nextPosition as it does not yet exist
        if (roundID != currentValuedRoundId.value) {
            const prevPosition = currentValuedRounds.value[roundID].position;
            const nextPosition = currentValuedRounds.value[roundID + 1].position;
            const prevDrawLevel = prevPosition.drawLevel;
            const nextDrawLevel = nextPosition.drawLevel;
            const isNewDrawLevel = prevDrawLevel !== -1 && nextDrawLevel !== -1 && (prevDrawLevel === nextDrawLevel + 1);

            if (isNewDrawLevel) {
                return (maximumDrawLevel.value - nextDrawLevel + Number(isPureDraw(1))) * fringeOffset.value;
            }
        }

        return (maximumDrawLevel.value - drawLevel + Number(isPureDraw(1))) * fringeOffset.value;
    }

    /** 
     * Determines the draw level for the fringes in the 'Draw Level' view of the Visual Value History (VVH) graph.
     * @param {number} roundID - current round id.
     * @returns the fringe's draw level.
    */
    const roundDrawLevel = (roundID: number) => {
        const position = currentValuedRounds.value[roundID].position;
        const drawLevel = position.drawLevel;
        return drawLevel;
    }

    /** 
     * Determines whether a position is a pure-draw in the 'Draw Level' view of the Visual Value History (VVH) graph.
     * @param {number} roundID - current round id.
     * @returns true if the (starting) position is a pure-draw.
    */
    const isPureDraw = (roundID: number) => {
        const round = currentValuedRounds.value[roundID] ? currentValuedRounds.value[roundID] : null;
        const position = round ? round.position : null;
        const drawRemoteness = position ? position.drawRemoteness : -1;
        return drawRemoteness !== -1;
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

                >.fringe-row-heading {
                    fill: "white";
                    font-size: 0.08rem;
                    font-weight: 400;
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

                >.fringe-row {
                    fill: purple;
                    opacity: 100%;
                    stroke: purple;
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

                    &.draw-lose {
                        fill: var(--drawColor);
                        stroke: var(--loseColor);
                    }

                    &.draw-win {
                        fill: var(--drawColor);
                        stroke: var(--winColor);
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


