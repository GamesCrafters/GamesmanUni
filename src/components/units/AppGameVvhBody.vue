<template>
    <div id="app-game-vvh-body">
        <p id="color-guides" v-if="showVvhGuides">
            <mark class="uni-win color">win</mark>
            <mark class="uni-draw color">draw</mark>
            <mark class="uni-tie color">tie</mark>
            <mark class="uni-lose color">lose</mark>
        </p>
        <p class="top x-axis-label" v-if="showVvhGuides">
            <b>Remoteness</b>
        </p>
        <div id="body">
            <p id="left-y-axis-label" v-if="showVvhGuides && !isPuzzleGame">
                <b>Moves</b>
            </p>
            
            <!-- Chart -->
            <svg id="chart" :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
                             xmlns="http://www.w3.org/2000/svg">
                <!-- Winning Directions -->
                <template v-if="showVvhGuides">
                    <template v-if="isPuzzleGame">
                        <text class="player-winning-direction"
                                :x="gridRight"
                                :y="winningDirectionHeight / 2"
                                dominant-baseline="middle"
                                text-anchor="end">
                            <tspan id="player">{{ currentLeftPlayerName }}</tspan>
                            Winning ⮕|
                        </text>
                        <text class="player-winning-direction"
                                :x="gridRight"
                                :y="chartHeight - winningDirectionHeight / 2"
                                dominant-baseline="middle"
                                text-anchor="end">
                            <tspan id="player">{{ currentLeftPlayerName }}</tspan>
                            Winning ⮕|
                        </text>
                    </template>
                    <template v-else>
                        <text class="left-player-winning-direction" 
                                :x="gridLeft"
                                :y="winningDirectionHeight / 2"
                                dominant-baseline="middle"
                                text-anchor="start">
                            |⬅
                            <tspan id="player-1">{{ currentLeftPlayerName }}</tspan>
                            Winning
                        </text>
                        <text class="right-player-winning-direction"
                                :x="gridRight"
                                :y="winningDirectionHeight / 2"
                                dominant-baseline="middle"
                                text-anchor="end">
                            <tspan id="player-2">{{ currentRightPlayerName }}</tspan>
                            Winning ⮕|
                        </text>
                        <text class="left-player-winning-direction"
                                :x="gridLeft"
                                :y="chartHeight - winningDirectionHeight / 2"
                                dominant-baseline="middle"
                                text-anchor="start">
                            |⬅
                            <tspan id="player-1">{{ currentLeftPlayerName }}</tspan>
                            Winning
                        </text>
                        <text class="right-player-winning-direction"
                                :x="gridRight"
                                :y="chartHeight - winningDirectionHeight / 2"
                                dominant-baseline="middle"
                                text-anchor="end">
                            <tspan id="player-2">{{ currentRightPlayerName }}</tspan>
                            Winning ⮕|
                        </text>
                    </template>
                </template>

                <!-- D Symbols -->
                <text class="draw-symbol" :x="isPuzzleGame ? gridLeft : chartWidth / 2"
                                          :y="gridTop - xCoordinateHeight / 2"
                                          dominant-baseline="middle"
                                          text-anchor="middle">D</text>
                <text class="draw-symbol" :x="isPuzzleGame ? gridLeft : chartWidth / 2"
                                          :y="gridBottom + xCoordinateHeight / 2"
                                          dominant-baseline="middle"
                                          text-anchor="middle">D</text>

                <!-- Remoteness Coordinates -->
                <template v-for="(_, remoteness) in Math.max(5, maximumRemoteness) + 1"
                        :key="remoteness">
                    <text class="remoteness-coordinate"
                            v-if="!isPuzzleGame &&remoteness % xInterval === 0"
                            :x="gridLeft + remoteness * columnWidth"
                            :y="gridTop - xCoordinateHeight / 2"
                            dominant-baseline="middle"
                            text-anchor="middle">
                        {{ remoteness }}
                    </text>
                    <text class="remoteness-coordinate"
                            v-if="remoteness % xInterval === 0"
                            :x="gridRight - remoteness * columnWidth"
                            :y="gridTop - xCoordinateHeight / 2"
                            dominant-baseline="middle"
                            text-anchor="middle">
                        {{ remoteness }}
                    </text>
                    <text class="remoteness-coordinate"
                            v-if="!isPuzzleGame && remoteness % xInterval === 0"
                            :x="gridLeft + remoteness * columnWidth"
                            :y="gridBottom + xCoordinateHeight / 2"
                            dominant-baseline="middle"
                            text-anchor="middle">
                        {{ remoteness }}
                    </text>
                    <text class="remoteness-coordinate"
                            v-if="remoteness % xInterval === 0"
                            :x="gridRight - remoteness * columnWidth"
                            :y="gridBottom + xCoordinateHeight / 2"
                            dominant-baseline="middle"
                            text-anchor="middle">
                        {{ remoteness }}
                    </text>
                </template>

                <!-- Move Coordinates -->
                <template v-if="currentRoundId >= 2">
                    <template v-for="roundNumber in currentRoundId - 1"
                            :key="roundNumber">
                        <text class="move-coordinate"
                                v-if="!isPuzzleGame && currentRounds[roundNumber].firstPlayerTurn"
                                :x="yCoordinateWidth / 2"
                                :y="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                dominant-baseline="middle"
                                text-anchor="middle">
                            {{ currentRounds[roundNumber].moveName }}
                        </text>
                        <text class="move-coordinate"
                                v-else
                                :x="gridRight + yCoordinateWidth / 2"
                                :y="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                dominant-baseline="middle"
                                text-anchor="middle">
                            {{ currentRounds[roundNumber].moveName }}
                        </text>
                    </template>

                    <template v-if="isEndOfMatch">
                        <template v-if="isPuzzleGame">
                            <text class="move-coordinate"
                                    :x="gridRight + yCoordinateWidth / 2"
                                    :y="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    dominant-baseline="middle"
                                    text-anchor="middle">
                                🥳
                            </text>
                        </template>
                        <template v-else-if="currentPositionValue === 'tie'">
                            <text class="move-coordinate"
                                    :x="yCoordinateWidth / 2"
                                    :y="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    dominant-baseline="middle"
                                    text-anchor="middle">
                                🤔
                            </text>
                            <text class="move-coordinate"
                                    :x="gridRight + yCoordinateWidth / 2"
                                    :y="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    dominant-baseline="middle"
                                    text-anchor="middle">
                                🤔
                            </text>
                        </template>
                        <template v-else>
                            <text class="move-coordinate"
                                    :x="yCoordinateWidth / 2"
                                    :y="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    dominant-baseline="middle"
                                    text-anchor="middle"> {{ 
                                (currentFirstPlayerTurn && currentPositionValue === "win") ||
                                (!currentFirstPlayerTurn && currentPositionValue === "lose") ?
                                "🥳" : "😢"
                            }} </text>
                            <text class="move-coordinate"
                                    :x="gridRight + yCoordinateWidth / 2"
                                    :y="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    dominant-baseline="middle"
                                    text-anchor="middle"> {{
                                (!currentFirstPlayerTurn && currentPositionValue === "win") ||
                                (currentFirstPlayerTurn && currentPositionValue === "lose") ?
                                "🥳" : "😢" 
                            }}</text>
                        </template>
                    </template>
                </template>

                <!-- Grid Base -->
                <rect id="grid-base" :x="gridLeft" :y="gridTop" :width="gridWidth" :height="gridHeight" />

                <!-- Round Rows -->
                <template v-if="currentRoundId >= 1">
                    <template v-for="roundNumber in currentRoundId" :key="roundNumber">
                        <rect :class="`turn-${turn(roundNumber)}`" class="round-row"
                            :x="gridLeft"
                            :y="gridTop + (roundNumber - 1) * rowHeight"
                            :width="gridWidth"
                            :height="rowHeight" />
                    </template>
                </template>
                <rect v-if="!isEndOfMatch"
                    :class="`turn-${isPuzzleGame ? 1 : turn(currentRoundId) === 1 ? 2 : 1}`"
                    class="round-row"
                    :x="gridLeft"
                    :y="gridBottom - rowHeight"
                    :width="gridWidth"
                    :height="rowHeight" />

                <!-- Remoteness Bars -->
                <template v-for="(_, remoteness) in Math.max(5, maximumRemoteness) + 2" :key="remoteness">
                    <line v-if="!isPuzzleGame"
                        :class="remoteness % xInterval !== 0 && remoteness !== Math.max(5, maximumRemoteness) + 1 ?
                            'remoteness-bar' : 'remoteness-interval-bar'"
                        :x1="gridLeft + remoteness * columnWidth"
                        :y1="gridTop"
                        :x2="gridLeft + remoteness * columnWidth"
                        :y2="gridBottom"
                        :stroke-width="remoteness % xInterval !== 0 && remoteness !== Math.max(5, maximumRemoteness) + 1 ?
                            xBarWidth : xIntervalBarWidth" />
                    <line :class="remoteness % xInterval !== 0 && remoteness !== Math.max(5, maximumRemoteness) + 1 ?
                              'remoteness-bar' : 'remoteness-interval-bar'"
                          :x1="gridRight - remoteness * columnWidth"
                          :y1="gridTop"
                          :x2="gridRight - remoteness * columnWidth"
                          :y2="gridBottom"
                          :stroke-width="remoteness % xInterval !== 0 && remoteness !== Math.max(5, maximumRemoteness) + 1 ?
                              xBarWidth : xIntervalBarWidth" />
                </template>

                <!-- Next Moves' Position Values -->
                <template v-if="showNextMoves && currentRoundId >= 1">
                    <template v-for="roundNumber in currentRoundId" :key="roundNumber">
                        <template v-for="nextMove in currentRounds[roundNumber].position.availableMoves"
                                :key="nextMove.move">
                            <template v-if="nextMove.moveValue === 'draw'">
                                <circle :class="{ clickable: roundNumber === currentRoundId, draw: showNextMoveHints }"
                                    class="next-move-position-value"
                                    :cx="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :cy="gridTop + roundNumber * rowHeight + rowHeight / 2"
                                    :r="nextMovePositionValueSize"
                                    :stroke-width="4 * nextMovePositionValueSize"
                                    @click="roundNumber === currentRoundId &&
                                        store.dispatch(actionTypes.runMove, { move: nextMove.move })" />
                            </template>
                            <template v-else-if="nextMove.moveValue === 'tie'">
                                <circle v-if="!isPuzzleGame"
                                    :class="{ clickable: roundNumber === currentRoundId, tie: showNextMoveHints }"
                                    class="next-move-position-value"
                                    :cx="gridLeft + nextMove.remoteness * columnWidth"
                                    :cy="gridTop + roundNumber * rowHeight + rowHeight / 2"
                                    :r="nextMovePositionValueSize"
                                    :stroke-width="4 * nextMovePositionValueSize"
                                    @click="roundNumber === currentRoundId &&
                                        store.dispatch(actionTypes.runMove, { move: nextMove.move })" />
                                <circle :class="{ clickable: roundNumber === currentRoundId, tie: showNextMoveHints }"
                                    class="next-move-position-value"
                                    :cx="gridRight - nextMove.remoteness * columnWidth"
                                    :cy="gridTop + roundNumber * rowHeight + rowHeight / 2"
                                    :r="nextMovePositionValueSize"
                                    :stroke-width="4 * nextMovePositionValueSize"
                                    @click="roundNumber === currentRoundId &&
                                        store.dispatch(actionTypes.runMove, { move: nextMove.move })" />
                            </template>
                            <template v-else>
                                <circle :class="[roundNumber === currentRoundId ? 'clickable' : '',
                                                 showNextMoveHints ? nextMove.positionValue : '']"
                                    class="next-move-position-value"
                                    :cx="isPuzzleGame ? gridRight - nextMove.remoteness * columnWidth : nextMove.moveValue === 'win' ?
                                        (turn(roundNumber) === 1 ?
                                        gridLeft + nextMove.remoteness * columnWidth :
                                        gridRight - nextMove.remoteness * columnWidth) :
                                        turn(roundNumber) === 1 ? gridRight - nextMove.remoteness * columnWidth :
                                        gridLeft + nextMove.remoteness * columnWidth"
                                    :cy="gridTop + roundNumber * rowHeight + rowHeight / 2" :r="nextMovePositionValueSize"
                                    :stroke-width="4 * nextMovePositionValueSize"
                                    @click="roundNumber === currentRoundId && store.dispatch(actionTypes.runMove, { move: nextMove.move })" />
                            </template>
                        </template>
                    </template>
                </template>

                <!-- Position Value Links -->
                <template v-if="currentRoundId >= 2">
                    <template v-for="roundNumber in currentRoundId - 1" :key="roundNumber">
                        <template v-if="currentRounds[roundNumber].position.positionValue === 'draw'">
                            <template v-if="currentRounds[roundNumber + 1].position.positionValue === 'draw'">
                                <line :class="`${currentRounds[roundNumber].moveValue} link`"
                                    :x1="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else-if="currentRounds[roundNumber + 1].position.positionValue === 'tie'">
                                <line v-if="!isPuzzleGame"
                                    :class="`${currentRounds[roundNumber].moveValue} link`"
                                    :x1="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="gridLeft + currentRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${currentRounds[roundNumber].moveValue} link`"
                                    :x1="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="gridRight - currentRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else>
                                <line :class="`${currentRounds[roundNumber].moveValue} link`"
                                :x1="isPuzzleGame ? gridLeft : chartWidth / 2"
                                :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                :x2="isPuzzleGame ?
                                    gridRight - currentRounds[roundNumber + 1].position.remoteness * columnWidth :
                                    currentRounds[roundNumber + 1].position.positionValue === 'win' ?
                                    (turn(roundNumber + 1) === 1 ?
                                    gridLeft + currentRounds[roundNumber + 1].position.remoteness * columnWidth :
                                    gridRight - currentRounds[roundNumber + 1].position.remoteness * columnWidth) :
                                    turn(roundNumber + 1) === 1 ?
                                    gridRight - currentRounds[roundNumber + 1].position.remoteness * columnWidth :
                                    gridLeft + currentRounds[roundNumber + 1].position.remoteness * columnWidth"
                                :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                :stroke-width="linkWidth" />
                            </template>
                        </template>
                        <template v-else-if="currentRounds[roundNumber].position.positionValue === 'tie'">
                            <template v-if="currentRounds[roundNumber + 1].position.positionValue === 'draw'">
                                <line v-if="!isPuzzleGame"
                                    :class="`${currentRounds[roundNumber].moveValue} link`"
                                    :x1="gridLeft + currentRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="chartWidth / 2"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${currentRounds[roundNumber].moveValue} link`"
                                    :x1="gridRight - currentRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else-if="currentRounds[roundNumber + 1].position.positionValue === 'tie'">
                                <line v-if="!isPuzzleGame"
                                    :class="`${currentRounds[roundNumber].moveValue} link`"
                                    :x1="gridLeft + currentRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="gridLeft + currentRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${currentRounds[roundNumber].moveValue} link`"
                                    :x1="gridRight - currentRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="gridRight - currentRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else>
                                <line v-if="!isPuzzleGame"
                                :class="`${currentRounds[roundNumber].moveValue} link`"
                                    :x1="gridLeft + currentRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="currentRounds[roundNumber + 1].position.positionValue === 'win' ?
                                        (turn(roundNumber + 1) === 1 ?
                                        gridLeft + currentRounds[roundNumber + 1].position.remoteness * columnWidth :
                                        gridRight - currentRounds[roundNumber + 1].position.remoteness * columnWidth) :
                                        turn(roundNumber + 1) === 1 ?
                                        gridRight - currentRounds[roundNumber + 1].position.remoteness * columnWidth :
                                        gridLeft + currentRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${currentRounds[roundNumber].moveValue} link`"
                                    :x1="gridRight - currentRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ?
                                        gridRight - currentRounds[roundNumber + 1].position.remoteness * columnWidth :
                                        currentRounds[roundNumber + 1].position.positionValue === 'win' ?
                                        (turn(roundNumber + 1) === 1 ?
                                        gridLeft + currentRounds[roundNumber + 1].position.remoteness * columnWidth :
                                        gridRight - currentRounds[roundNumber + 1].position.remoteness * columnWidth) :
                                        turn(roundNumber + 1) === 1 ?
                                        gridRight - currentRounds[roundNumber + 1].position.remoteness * columnWidth :
                                        gridLeft + currentRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                        </template>
                        <template v-else>
                            <template v-if="currentRounds[roundNumber + 1].position.positionValue === 'draw'">
                                <line :class="`${currentRounds[roundNumber].moveValue} link`"
                                    :x1="isPuzzleGame ?
                                        gridRight - currentRounds[roundNumber].position.remoteness * columnWidth :
                                        currentRounds[roundNumber].position.positionValue === 'win' ?
                                        (turn(roundNumber) === 1 ?
                                        gridLeft + currentRounds[roundNumber].position.remoteness * columnWidth :
                                        gridRight - currentRounds[roundNumber].position.remoteness * columnWidth) :
                                        turn(roundNumber) === 1 ?
                                        gridRight - currentRounds[roundNumber].position.remoteness * columnWidth :
                                        gridLeft + currentRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else-if="currentRounds[roundNumber + 1].position.positionValue === 'tie'">
                                <line v-if="!isPuzzleGame" :class="`${currentRounds[roundNumber].moveValue} link`"
                                    :x1="isPuzzleGame ?
                                        gridRight - currentRounds[roundNumber].position.remoteness * columnWidth :
                                        currentRounds[roundNumber].position.positionValue === 'win' ?
                                        (turn(roundNumber) === 1 ?
                                        gridLeft + currentRounds[roundNumber].position.remoteness * columnWidth :
                                        gridRight - currentRounds[roundNumber].position.remoteness * columnWidth) :
                                        turn(roundNumber) === 1 ?
                                        gridRight - currentRounds[roundNumber].position.remoteness * columnWidth :
                                        gridLeft + currentRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="gridLeft + currentRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${currentRounds[roundNumber].moveValue} link`"
                                    :x1="isPuzzleGame ?
                                        gridRight - currentRounds[roundNumber].position.remoteness * columnWidth :
                                        currentRounds[roundNumber].position.positionValue === 'win' ?
                                        (turn(roundNumber) === 1 ?
                                        gridLeft + currentRounds[roundNumber].position.remoteness * columnWidth :
                                        gridRight - currentRounds[roundNumber].position.remoteness * columnWidth) :
                                        turn(roundNumber) === 1 ?
                                        gridRight - currentRounds[roundNumber].position.remoteness * columnWidth :
                                        gridLeft + currentRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="gridRight - currentRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else>
                                <line :class="`${currentRounds[roundNumber].moveValue} link`"
                                    :x1="isPuzzleGame ?
                                        gridRight - currentRounds[roundNumber].position.remoteness * columnWidth :
                                        currentRounds[roundNumber].position.positionValue === 'win' ?
                                        (turn(roundNumber) === 1
                                        ? gridLeft + currentRounds[roundNumber].position.remoteness * columnWidth :
                                        gridRight - currentRounds[roundNumber].position.remoteness * columnWidth) :
                                        turn(roundNumber) === 1 ?
                                        gridRight - currentRounds[roundNumber].position.remoteness * columnWidth :
                                        gridLeft + currentRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ?
                                        gridRight - currentRounds[roundNumber + 1].position.remoteness * columnWidth
                                        : currentRounds[roundNumber + 1].position.positionValue === 'win' ?
                                        (turn(roundNumber + 1) === 1 ?
                                        gridLeft + currentRounds[roundNumber + 1].position.remoteness * columnWidth :
                                        gridRight - currentRounds[roundNumber + 1].position.remoteness * columnWidth) :
                                        turn(roundNumber + 1) === 1 ?
                                        gridRight - currentRounds[roundNumber + 1].position.remoteness * columnWidth :
                                        gridLeft + currentRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                        </template>
                    </template>
                </template>

                <!-- Link from Current Position Value to Next Moves' Position Value -->
                <template v-if="showNextMoves && currentRounds[currentRoundId]">
                    <template v-for="nextMove in currentRounds[currentRoundId].position.availableMoves">
                        <template v-if="currentRounds[currentRoundId].position.positionValue === 'draw'">
                            <template v-if="nextMove.moveValue === 'draw'">
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y1="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y2="gridTop + currentRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else-if="nextMove.moveValue === 'tie'">
                                <line v-if="!isPuzzleGame"
                                    :class="`${nextMove.moveValue} link`"
                                    :x1="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y1="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    :x2="gridLeft + nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y1="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    :x2="gridRight - nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else>
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y1="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ?
                                        gridRight - nextMove.remoteness * columnWidth :
                                        nextMove.moveValue === 'win' ?
                                        (turn(currentRoundId) === 1 ?
                                        gridLeft + nextMove.remoteness * columnWidth :
                                        gridRight - nextMove.remoteness * columnWidth) :
                                        turn(currentRoundId) === 1 ?
                                        gridRight - nextMove.remoteness * columnWidth :
                                        gridLeft + nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                        </template>
                        <template v-else-if="currentRounds[currentRoundId].position.positionValue === 'tie'">
                            <template v-if="nextMove.moveValue === 'draw'">
                                <line v-if="!isPuzzleGame"
                                    :class="`${nextMove.moveValue} link`"
                                    :x1="gridLeft + currentRounds[currentRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y2="gridTop + currentRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="gridRight - currentRounds[currentRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y2="gridTop + currentRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else-if="nextMove.moveValue === 'tie'">
                                <line v-if="!isPuzzleGame"
                                    :class="`${nextMove.moveValue} link`"
                                    :x1="gridLeft + currentRounds[currentRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    :x2="gridLeft + nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="gridRight - currentRounds[currentRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    :x2="gridRight - nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else>
                                <line v-if="!isPuzzleGame"
                                    :class="`${nextMove.moveValue} link`"
                                    :x1="gridLeft + currentRounds[currentRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ?
                                        gridRight - nextMove.remoteness * columnWidth :
                                        nextMove.moveValue === 'win' ?
                                        (turn(currentRoundId) === 1 ?
                                        gridLeft + nextMove.remoteness * columnWidth :
                                        gridRight - nextMove.remoteness * columnWidth) :
                                        turn(currentRoundId) === 1 ?
                                        gridRight - nextMove.remoteness * columnWidth :
                                        gridLeft + nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="gridRight - currentRounds[currentRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ?
                                        gridRight - nextMove.remoteness * columnWidth :
                                        nextMove.moveValue === 'win' ?
                                        (turn(currentRoundId) === 1 ?
                                        gridLeft + nextMove.remoteness * columnWidth :
                                        gridRight - nextMove.remoteness * columnWidth) :
                                        turn(currentRoundId) === 1 ?
                                        gridRight - nextMove.remoteness * columnWidth :
                                        gridLeft + nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                        </template>
                        <template v-else>
                            <template v-if="nextMove.moveValue === 'draw'">
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="isPuzzleGame ?
                                        gridRight - currentRounds[currentRoundId].position.remoteness * columnWidth :
                                        currentRounds[currentRoundId].position.positionValue === 'win' ?
                                        (turn(currentRoundId) === 1 ?
                                        gridLeft + currentRounds[currentRoundId].position.remoteness * columnWidth :
                                        gridRight - currentRounds[currentRoundId].position.remoteness * columnWidth) :
                                        turn(currentRoundId) === 1 ?
                                        gridRight - currentRounds[currentRoundId].position.remoteness * columnWidth :
                                        gridLeft + currentRounds[currentRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y2="gridTop + currentRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else-if="nextMove.moveValue === 'tie'">
                                <line v-if="!isPuzzleGame"
                                    :class="`${nextMove.moveValue} link`"
                                    :x1="isPuzzleGame ?
                                        gridRight - currentRounds[currentRoundId].position.remoteness * columnWidth :
                                        currentRounds[currentRoundId].position.positionValue === 'win' ?
                                        (turn(currentRoundId) === 1 ?
                                        gridLeft + currentRounds[currentRoundId].position.remoteness * columnWidth :
                                        gridRight - currentRounds[currentRoundId].position.remoteness * columnWidth) :
                                        turn(currentRoundId) === 1 ?
                                        gridRight - currentRounds[currentRoundId].position.remoteness * columnWidth :
                                        gridLeft + currentRounds[currentRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    :x2="gridLeft + nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="isPuzzleGame ?
                                        gridRight - currentRounds[currentRoundId].position.remoteness * columnWidth :
                                        currentRounds[currentRoundId].position.positionValue === 'win' ?
                                        (turn(currentRoundId) === 1 ?
                                        gridLeft + currentRounds[currentRoundId].position.remoteness * columnWidth :
                                        gridRight - currentRounds[currentRoundId].position.remoteness * columnWidth) :
                                        turn(currentRoundId) === 1 ?
                                        gridRight - currentRounds[currentRoundId].position.remoteness * columnWidth :
                                        gridLeft + currentRounds[currentRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    :x2="gridRight - nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else>
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="isPuzzleGame ?
                                        gridRight - currentRounds[currentRoundId].position.remoteness * columnWidth :
                                        currentRounds[currentRoundId].position.positionValue === 'win' ?
                                        (turn(currentRoundId) === 1 ?
                                        gridLeft + currentRounds[currentRoundId].position.remoteness * columnWidth :
                                        gridRight - currentRounds[currentRoundId].position.remoteness * columnWidth) :
                                        turn(currentRoundId) === 1 ?
                                        gridRight - currentRounds[currentRoundId].position.remoteness * columnWidth :
                                        gridLeft + currentRounds[currentRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentRoundId * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ?
                                        gridRight - nextMove.remoteness * columnWidth :
                                        nextMove.moveValue === 'win' ?
                                        (turn(currentRoundId) === 1 ?
                                        gridLeft + nextMove.remoteness * columnWidth :
                                        gridRight - nextMove.remoteness * columnWidth) :
                                        turn(currentRoundId) === 1 ?
                                        gridRight - nextMove.remoteness * columnWidth :
                                        gridLeft + nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                        </template>
                    </template>
                </template>

                <!-- Position Values -->
                <template v-if="currentRoundId >= 1">
                    <template v-for="roundNumber in currentRoundId" :key="roundNumber">
                        <template v-if="currentRounds[roundNumber].position.positionValue === 'draw'">
                            <circle :class="roundNumber !== currentRoundId ? 'clickable' : ''"
                                class="draw position-value"
                                :cx="isPuzzleGame ? gridLeft : chartWidth / 2"
                                :cy="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                :r="positionValueSize"
                                :stroke-width="4 * positionValueSize"
                                @click="roundNumber !== currentRoundId &&
                                    store.dispatch(actionTypes.undoMove, {
                                        count: currentRoundId - currentRounds[roundNumber].id
                                    })" />
                        </template>
                        <template v-else-if="currentRounds[roundNumber].position.positionValue === 'tie'">
                            <circle v-if="!isPuzzleGame"
                                :class="roundNumber !== currentRoundId ? 'clickable' : ''"
                                class="tie position-value"
                                :cx="gridLeft + currentRounds[roundNumber].position.remoteness * columnWidth"
                                :cy="gridTop + roundNumber * rowHeight - rowHeight / 2" :r="positionValueSize"
                                :stroke-width="4 * positionValueSize"
                                @click="roundNumber !== currentRoundId &&
                                    store.dispatch(actionTypes.undoMove, {
                                        count: currentRoundId - currentRounds[roundNumber].id
                                    })" />
                            <line v-if="!isPuzzleGame"
                                :class="roundNumber !== currentRoundId ? 'clickable' : ''"
                                class="tie position-value link"
                                :x1="gridLeft + currentRounds[roundNumber].position.remoteness * columnWidth"
                                :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                :x2="gridRight - currentRounds[roundNumber].position.remoteness * columnWidth"
                                :y2="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                :stroke-width="linkWidth"
                                @click="roundNumber !== currentRoundId &&
                                    store.dispatch(actionTypes.undoMove, {
                                        count: currentRoundId - currentRounds[roundNumber].id
                                    })" />
                            <circle :class="roundNumber !== currentRoundId ? 'clickable' : ''"
                                class="tie position-value"
                                :cx="gridRight - currentRounds[roundNumber].position.remoteness * columnWidth"
                                :cy="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                :r="positionValueSize"
                                :stroke-width="4 * positionValueSize"
                                @click="roundNumber !== currentRoundId &&
                                    store.dispatch(actionTypes.undoMove, {
                                        count: currentRoundId - currentRounds[roundNumber].id
                                    })" />
                        </template>
                        <template v-else>
                            <circle :class="[roundNumber !== currentRoundId ?
                                    'clickable' :
                                    '', currentRounds[roundNumber].position.positionValue]"
                                class="position-value"
                                :cx="isPuzzleGame ?
                                    gridRight - currentRounds[roundNumber].position.remoteness * columnWidth :
                                    currentRounds[roundNumber].position.positionValue === 'win' ?
                                    (turn(roundNumber) === 1 ?
                                    gridLeft + currentRounds[roundNumber].position.remoteness * columnWidth :
                                    gridRight - currentRounds[roundNumber].position.remoteness * columnWidth) :
                                    turn(roundNumber) === 1 ?
                                    gridRight - currentRounds[roundNumber].position.remoteness * columnWidth :
                                    gridLeft + currentRounds[roundNumber].position.remoteness * columnWidth"
                                :cy="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                :r="positionValueSize"
                                :stroke-width="4 * positionValueSize"
                                @click="roundNumber !== currentRoundId &&
                                    store.dispatch(actionTypes.undoMove, {
                                        count: currentRoundId - currentRounds[roundNumber].id
                                    })" />
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
                <VueSlider v-model="xCoordinateHeight" :min="1" :max="50" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Move Coordinate Width</p>
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
                <p class="label">Remoteness Bar Width</p>
                <VueSlider v-model="xBarWidth" :min="0.1" :max="5" :interval="0.1" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Remoteness Interval Bar Width</p>
                <VueSlider v-model="xIntervalBarWidth" :min="0.1" :max="5" :interval="0.1" :tooltip="'active'" />
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
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import VueSlider from "vue-slider-component";
    import "vue-slider-component/theme/default.css";

    const store = useStore();

    const options = computed(() => store.getters.options);
    const showNextMoves = computed(() => (options.value ? options.value.showNextMoves : true));
    const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));
    const showVvhGuides = computed(() => (options.value ? options.value.showVvhGuides : true));
    const showVvhMeters = computed(() => (options.value ? options.value.showVvhMeters : false));

    const isPuzzleGame = computed(() => store.getters.currentGameType === "puzzles");

    const currentLeftPlayerName = computed(() => (store.getters.currentLeftPlayer ? store.getters.currentLeftPlayer.name : ""));
    const currentRightPlayerName = computed(() => (store.getters.currentRightPlayer ? store.getters.currentRightPlayer.name : ""));

    const currentRoundId = computed(() => store.getters.currentRoundId);
    const currentPositionValue = computed(() => store.getters.currentPositionValue);
    const currentRounds = computed(() => store.getters.currentRounds);
    const currentFirstPlayerTurn = computed(() => store.getters.currentMatch.round.firstPlayerTurn);

    const maximumRemoteness = computed(() => store.getters.maximumRemoteness(1, store.getters.currentRoundId));
    const isEndOfMatch = computed(() => store.getters.isEndOfMatch);

    const winningDirectionHeight = ref(2);
    const xCoordinateHeight = ref(2);
    const rowHeight = ref(2);
    const rowCount = computed(() => (isEndOfMatch.value ? currentRoundId.value : currentRoundId.value + 1));
    const gridTop = computed(() => winningDirectionHeight.value + xCoordinateHeight.value);
    const gridHeight = computed(() => rowHeight.value * rowCount.value);
    const chartHeight = computed(() => 2 * gridTop.value + gridHeight.value);
    const gridBottom = computed(() => chartHeight.value - gridTop.value);

    const yCoordinateWidth = ref(5);
    const chartWidth = ref(50);
    const columnCount = computed(() => (isPuzzleGame.value ? 1 : 2) * (Math.max(5, maximumRemoteness.value) + 1));
    const gridWidth = computed(() => chartWidth.value - 2 * yCoordinateWidth.value);
    const columnWidth = computed(() => gridWidth.value / columnCount.value);
    const gridLeft = computed(() => yCoordinateWidth.value);
    const gridRight = computed(() => chartWidth.value - gridLeft.value);

    const positionValueSize = ref(0.2);
    const nextMovePositionValueSize = ref(0.1);
    const xInterval = ref(5);
    const linkWidth = ref(0.2);
    const xBarWidth = ref(0.1);
    const xIntervalBarWidth = ref(0.2);

    const turn = (roundID: number) => {
        return currentRounds.value[roundID].firstPlayerTurn ? 1 : 2;
    };
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
                padding: 0.25rem 0.5rem;
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
                > .player-winning-direction,
                > .left-player-winning-direction,
                > .right-player-winning-direction {
                    fill: var(--primaryColor);
                    font-size: 0.07rem;
                    font-weight: 400;
                    > #player,
                    > #player-1 {
                        fill: var(--turn1Color);
                        font-size: 0.07rem;
                        font-weight: 400;
                    }
                    > #player-2 {
                        fill: var(--turn2Color);
                        font-size: 0.07rem;
                        font-weight: 400;
                    }
                }
                > .draw-symbol {
                    fill: var(--primaryColor);
                    font-size: 0.07rem;
                }
                > .remoteness-coordinate {
                    fill: var(--primaryColor);
                    font-size: 0.07rem;
                }
                > .move-coordinate {
                    fill: var(--primaryColor);
                    font-size: 0.07rem;
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
                    stroke: black;
                }
                > .position-value,
                > .next-move-position-value {
                    &.clickable:hover {
                        cursor: pointer;
                    }
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
                padding: 0.5rem;
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
