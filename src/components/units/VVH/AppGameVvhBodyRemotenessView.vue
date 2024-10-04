<template>
    <div id="app-game-vvh-body-remotenessview">
        <div id="body">
            <p id="left-y-axis-label" v-if="toggleGuides && !isPuzzleGame">
                <b>Moves</b>
            </p>
            <svg id="chart" :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
                             xmlns="http://www.w3.org/2000/svg">
                <!-- Winning Directions -->
                <template v-if="toggleGuides">
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

                <!-- D Symbols for Games and F Symbols for Puzzles -->
                <text class="draw-symbol" :x="isPuzzleGame ? gridLeft : gridCenter"
                                          :y="gridTop - xCoordinateHeight / 2"
                                          dominant-baseline="middle"
                                          text-anchor="middle">{{ isPuzzleGame ? 'F' : 'D' }}</text>
                <text class="draw-symbol" :x="isPuzzleGame ? gridLeft : gridCenter"
                                          :y="gridBottom + xCoordinateHeight / 2"
                                          dominant-baseline="middle"
                                          text-anchor="middle">{{ isPuzzleGame ? 'F' : 'D' }}</text>

                <!-- Remoteness Coordinates -->
                <template v-for="(_, remoteness) in Math.max(0, maximumRemoteness) + 1"
                        :key="remoteness">
                    <text class="view-coordinate"
                            v-if="!isPuzzleGame &&remoteness % xInterval === 0"
                            :x="gridLeft + remoteness * columnWidth"
                            :y="gridTop - xCoordinateHeight / 2"
                            dominant-baseline="middle"
                            text-anchor="middle">
                        {{ remoteness }}
                    </text>
                    <text class="view-coordinate"
                            v-if="remoteness % xInterval === 0"
                            :x="gridRight - remoteness * columnWidth"
                            :y="gridTop - xCoordinateHeight / 2"
                            dominant-baseline="middle"
                            text-anchor="middle">
                        {{ remoteness }}
                    </text>
                    <text class="view-coordinate"
                            v-if="!isPuzzleGame && remoteness % xInterval === 0"
                            :x="gridLeft + remoteness * columnWidth"
                            :y="gridBottom + xCoordinateHeight / 2"
                            dominant-baseline="middle"
                            text-anchor="middle">
                        {{ remoteness }}
                    </text>
                    <text class="view-coordinate"
                            v-if="remoteness % xInterval === 0"
                            :x="gridRight - remoteness * columnWidth"
                            :y="gridBottom + xCoordinateHeight / 2"
                            dominant-baseline="middle"
                            text-anchor="middle">
                        {{ remoteness }}
                    </text>
                </template>

                <!-- Unknown Remoteness Remoteness Coordinates -->
                <template v-if="finiteUnknownRemotenessExists">
                    <text class="view-coordinate"
                            v-if="!isPuzzleGame"
                            :x="gridLeft + (maximumRemoteness + 1) * columnWidth"
                            :y="gridTop - xCoordinateHeight / 2"
                            dominant-baseline="middle"
                            text-anchor="middle">?</text>
                    <text class="view-coordinate"
                            :x="gridRight - (maximumRemoteness + 1) * columnWidth"
                            :y="gridTop - xCoordinateHeight / 2"
                            dominant-baseline="middle"
                            text-anchor="middle">?</text>
                    <text class="view-coordinate"
                            v-if="!isPuzzleGame"
                            :x="gridLeft + (maximumRemoteness + 1) * columnWidth"
                            :y="gridBottom + xCoordinateHeight / 2"
                            dominant-baseline="middle"
                            text-anchor="middle">?</text>
                    <text class="view-coordinate"
                            :x="gridRight - (maximumRemoteness + 1) * columnWidth"
                            :y="gridBottom + xCoordinateHeight / 2"
                            dominant-baseline="middle"
                            text-anchor="middle">?</text>
                </template>

                <!-- Move Coordinates (Move Names) -->
                <template v-if="currentValuedRoundId >= 2">
                    <template v-for="roundNumber in currentValuedRoundId - 1"
                            :key="roundNumber">
                        <text class="move-coordinate"
                                v-if="!isPuzzleGame && currentValuedRounds[roundNumber].firstPlayerTurn"
                                :x="yCoordinateWidth / 2"
                                :y="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                dominant-baseline="middle"
                                text-anchor="middle">
                            {{ currentValuedRounds[roundNumber].move[0] == '~' ? '' : currentValuedRounds[roundNumber].move }}
                        </text>
                        <text class="move-coordinate"
                                v-else
                                :x="gridRight + yCoordinateWidth / 2"
                                :y="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                dominant-baseline="middle"
                                text-anchor="middle">
                            {{ currentValuedRounds[roundNumber].move[0] == '~' ? '' : currentValuedRounds[roundNumber].move }}
                        </text>
                    </template>

                    <template v-if="isEndOfMatch">
                        <template v-if="isPuzzleGame">
                            <text class="move-coordinate"
                                    :x="gridRight + yCoordinateWidth / 2"
                                    :y="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    dominant-baseline="middle"
                                    text-anchor="middle">
                                {{ currentPositionValue === "win" ? "🥳" : "😢" }}
                            </text>
                        </template>
                        <template v-else-if="currentPositionValue === 'tie'">
                            <text class="move-coordinate"
                                    :x="yCoordinateWidth / 2"
                                    :y="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    dominant-baseline="middle"
                                    text-anchor="middle">
                                🤔
                            </text>
                            <text class="move-coordinate"
                                    :x="gridRight + yCoordinateWidth / 2"
                                    :y="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    dominant-baseline="middle"
                                    text-anchor="middle">
                                🤔
                            </text>
                        </template>
                        <template v-else>
                            <text class="move-coordinate"
                                    :x="yCoordinateWidth / 2"
                                    :y="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    dominant-baseline="middle"
                                    text-anchor="middle"> {{ 
                                (currentFirstPlayerTurn && currentPositionValue === "win") ||
                                (!currentFirstPlayerTurn && currentPositionValue === "lose") ?
                                "🥳" : "😢"
                            }} </text>
                            <text class="move-coordinate"
                                    :x="gridRight + yCoordinateWidth / 2"
                                    :y="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
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
                <template v-if="currentValuedRoundId >= 1">
                    <template v-for="roundNumber in currentValuedRoundId" :key="roundNumber">
                        <rect :class="`turn-${turn(roundNumber)}`" class="round-row"
                            :x="gridLeft"
                            :y="gridTop + (roundNumber - 1) * rowHeight"
                            :width="gridWidth"
                            :height="rowHeight" />
                    </template>
                </template>
                <rect v-if="!isEndOfMatch"
                    :class="`turn-0`"
                    class="round-row"
                    :x="gridLeft"
                    :y="gridBottom - rowHeight"
                    :width="gridWidth"
                    :height="rowHeight" />

                <!-- Remoteness Bars -->
                <template v-for="(_, remoteness) in Math.max(0, maximumRemoteness) + (finiteUnknownRemotenessExists ? 3 : 2)" :key="remoteness">
                    <line v-if="!isPuzzleGame"
                        :class="remoteness % xInterval !== 0 && remoteness < Math.max(0, maximumRemoteness) + 1 ?
                            'view-bar' : 'view-interval-bar'"
                        :x1="gridLeft + remoteness * columnWidth"
                        :y1="gridTop"
                        :x2="gridLeft + remoteness * columnWidth"
                        :y2="gridBottom"
                        :stroke-width="remoteness % xInterval !== 0 && remoteness < Math.max(0, maximumRemoteness) + 1 ?
                            xBarWidth : xIntervalBarWidth" />
                    <line :class="remoteness % xInterval !== 0 && remoteness < Math.max(0, maximumRemoteness) + 1 ?
                              'view-bar' : 'view-interval-bar'"
                          :x1="gridRight - remoteness * columnWidth"
                          :y1="gridTop"
                          :x2="gridRight - remoteness * columnWidth"
                          :y2="gridBottom"
                          :stroke-width="remoteness % xInterval !== 0 && remoteness < Math.max(0, maximumRemoteness) + 1 ?
                              xBarWidth : xIntervalBarWidth" />
                </template>

                <!-- Position Value Links -->
                <template v-if="currentValuedRoundId >= 2">
                    <template v-for="roundNumber in currentValuedRoundId - 1" :key="roundNumber">
                        <template v-if="currentValuedRounds[roundNumber].position.positionValue === 'draw' || currentValuedRounds[roundNumber].position.remoteness == Remoteness.INFINITY">
                            <template v-if="currentValuedRounds[roundNumber + 1].position.positionValue === 'draw' || currentValuedRounds[roundNumber + 1].position.remoteness == Remoteness.INFINITY">
                                <line :class="`${currentValuedRounds[roundNumber].moveValue} link`"
                                    :x1="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else-if="currentValuedRounds[roundNumber + 1].position.positionValue === 'tie'">
                                <line v-if="!isPuzzleGame"
                                    :class="`${currentValuedRounds[roundNumber].moveValue} link`"
                                    :x1="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="gridLeft + currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${currentValuedRounds[roundNumber].moveValue} link`"
                                    :x1="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="gridRight - currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else>
                                <line :class="`${currentValuedRounds[roundNumber].moveValue} link`"
                                :x1="isPuzzleGame ? gridLeft : chartWidth / 2"
                                :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                :x2="isPuzzleGame ?
                                    gridRight - currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth :
                                    currentValuedRounds[roundNumber + 1].position.positionValue === 'win' ?
                                    (turn(roundNumber + 1) === 1 ?
                                    gridLeft + currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth :
                                    gridRight - currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth) :
                                    turn(roundNumber + 1) === 1 ?
                                    gridRight - currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth :
                                    gridLeft + currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth"
                                :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                :stroke-width="linkWidth" />
                            </template>
                        </template>
                        <template v-else-if="currentValuedRounds[roundNumber].position.positionValue === 'tie'">
                            <template v-if="currentValuedRounds[roundNumber + 1].position.positionValue === 'draw' || currentValuedRounds[roundNumber + 1].position.remoteness == Remoteness.INFINITY">
                                <line v-if="!isPuzzleGame"
                                    :class="`${currentValuedRounds[roundNumber].moveValue} link`"
                                    :x1="gridLeft + currentValuedRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="chartWidth / 2"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${currentValuedRounds[roundNumber].moveValue} link`"
                                    :x1="gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else-if="currentValuedRounds[roundNumber + 1].position.positionValue === 'tie'">
                                <line v-if="!isPuzzleGame"
                                    :class="`${currentValuedRounds[roundNumber].moveValue} link`"
                                    :x1="gridLeft + currentValuedRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="gridLeft + currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${currentValuedRounds[roundNumber].moveValue} link`"
                                    :x1="gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="gridRight - currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else>
                                <line v-if="!isPuzzleGame"
                                :class="`${currentValuedRounds[roundNumber].moveValue} link`"
                                    :x1="gridLeft + currentValuedRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="currentValuedRounds[roundNumber + 1].position.positionValue === 'win' ?
                                        (turn(roundNumber + 1) === 1 ?
                                        gridLeft + currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth :
                                        gridRight - currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth) :
                                        turn(roundNumber + 1) === 1 ?
                                        gridRight - currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth :
                                        gridLeft + currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${currentValuedRounds[roundNumber].moveValue} link`"
                                    :x1="gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ?
                                        gridRight - currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth :
                                        currentValuedRounds[roundNumber + 1].position.positionValue === 'win' ?
                                        (turn(roundNumber + 1) === 1 ?
                                        gridLeft + currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth :
                                        gridRight - currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth) :
                                        turn(roundNumber + 1) === 1 ?
                                        gridRight - currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth :
                                        gridLeft + currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                        </template>
                        <template v-else>
                            <template v-if="currentValuedRounds[roundNumber + 1].position.positionValue === 'draw' || currentValuedRounds[roundNumber + 1].position.remoteness == Remoteness.INFINITY">
                                <line :class="`${currentValuedRounds[roundNumber].moveValue} link`"
                                    :x1="isPuzzleGame ?
                                        gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth :
                                        currentValuedRounds[roundNumber].position.positionValue === 'win' ?
                                        (turn(roundNumber) === 1 ?
                                        gridLeft + currentValuedRounds[roundNumber].position.remoteness * columnWidth :
                                        gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth) :
                                        turn(roundNumber) === 1 ?
                                        gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth :
                                        gridLeft + currentValuedRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else-if="currentValuedRounds[roundNumber + 1].position.positionValue === 'tie'">
                                <line v-if="!isPuzzleGame" :class="`${currentValuedRounds[roundNumber].moveValue} link`"
                                    :x1="isPuzzleGame ?
                                        gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth :
                                        currentValuedRounds[roundNumber].position.positionValue === 'win' ?
                                        (turn(roundNumber) === 1 ?
                                        gridLeft + currentValuedRounds[roundNumber].position.remoteness * columnWidth :
                                        gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth) :
                                        turn(roundNumber) === 1 ?
                                        gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth :
                                        gridLeft + currentValuedRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="gridLeft + currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${currentValuedRounds[roundNumber].moveValue} link`"
                                    :x1="isPuzzleGame ?
                                        gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth :
                                        currentValuedRounds[roundNumber].position.positionValue === 'win' ?
                                        (turn(roundNumber) === 1 ?
                                        gridLeft + currentValuedRounds[roundNumber].position.remoteness * columnWidth :
                                        gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth) :
                                        turn(roundNumber) === 1 ?
                                        gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth :
                                        gridLeft + currentValuedRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="gridRight - currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else>
                                <line :class="`${currentValuedRounds[roundNumber].moveValue} link`"
                                    :x1="isPuzzleGame ?
                                        gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth :
                                        currentValuedRounds[roundNumber].position.positionValue === 'win' ?
                                        (turn(roundNumber) === 1
                                        ? gridLeft + currentValuedRounds[roundNumber].position.remoteness * columnWidth :
                                        gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth) :
                                        turn(roundNumber) === 1 ?
                                        gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth :
                                        gridLeft + currentValuedRounds[roundNumber].position.remoteness * columnWidth"
                                    :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ?
                                        gridRight - currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth
                                        : currentValuedRounds[roundNumber + 1].position.positionValue === 'win' ?
                                        (turn(roundNumber + 1) === 1 ?
                                        gridLeft + currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth :
                                        gridRight - currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth) :
                                        turn(roundNumber + 1) === 1 ?
                                        gridRight - currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth :
                                        gridLeft + currentValuedRounds[roundNumber + 1].position.remoteness * columnWidth"
                                    :y2="gridTop + (roundNumber + 1) * rowHeight - rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                        </template>
                    </template>
                </template>

                <!-- Link from Current Position Value to Next Moves' Position Value -->
                <template v-if="showNextMoves && currentValuedRounds[currentValuedRoundId]">
                    <template v-for="nextMove in currentValuedRounds[currentValuedRoundId].position.availableMoves" :key="nextMove">
                        <template v-if="currentValuedRounds[currentValuedRoundId].position.positionValue === 'draw' || currentValuedRounds[currentValuedRoundId].position.remoteness == Remoteness.INFINITY">
                            <template v-if="nextMove.moveValue === 'draw' || nextMove.remoteness == Remoteness.INFINITY">
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y1="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y2="gridTop + currentValuedRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else-if="nextMove.moveValue === 'tie'">
                                <line v-if="!isPuzzleGame"
                                    :class="`${nextMove.moveValue} link`"
                                    :x1="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y1="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    :x2="gridLeft + nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentValuedRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y1="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    :x2="gridRight - nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentValuedRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else>
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y1="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ?
                                        gridRight - nextMove.remoteness * columnWidth :
                                        nextMove.moveValue === 'win' ?
                                        (turn(currentValuedRoundId) === 1 ?
                                        gridLeft + nextMove.remoteness * columnWidth :
                                        gridRight - nextMove.remoteness * columnWidth) :
                                        turn(currentValuedRoundId) === 1 ?
                                        gridRight - nextMove.remoteness * columnWidth :
                                        gridLeft + nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentValuedRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                        </template>
                        <template v-else-if="currentValuedRounds[currentValuedRoundId].position.positionValue === 'tie'">
                            <template v-if="nextMove.moveValue === 'draw' || nextMove.remoteness == Remoteness.INFINITY">
                                <line v-if="!isPuzzleGame"
                                    :class="`${nextMove.moveValue} link`"
                                    :x1="gridLeft + currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y2="gridTop + currentValuedRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="gridRight - currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y2="gridTop + currentValuedRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else-if="nextMove.moveValue === 'tie'">
                                <line v-if="!isPuzzleGame"
                                    :class="`${nextMove.moveValue} link`"
                                    :x1="gridLeft + currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    :x2="gridLeft + nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentValuedRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="gridRight - currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    :x2="gridRight - nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentValuedRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else>
                                <line v-if="!isPuzzleGame"
                                    :class="`${nextMove.moveValue} link`"
                                    :x1="gridLeft + currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ?
                                        gridRight - nextMove.remoteness * columnWidth :
                                        nextMove.moveValue === 'win' ?
                                        (turn(currentValuedRoundId) === 1 ?
                                        gridLeft + nextMove.remoteness * columnWidth :
                                        gridRight - nextMove.remoteness * columnWidth) :
                                        turn(currentValuedRoundId) === 1 ?
                                        gridRight - nextMove.remoteness * columnWidth :
                                        gridLeft + nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentValuedRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="gridRight - currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ?
                                        gridRight - nextMove.remoteness * columnWidth :
                                        nextMove.moveValue === 'win' ?
                                        (turn(currentValuedRoundId) === 1 ?
                                        gridLeft + nextMove.remoteness * columnWidth :
                                        gridRight - nextMove.remoteness * columnWidth) :
                                        turn(currentValuedRoundId) === 1 ?
                                        gridRight - nextMove.remoteness * columnWidth :
                                        gridLeft + nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentValuedRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                        </template>
                        <template v-else>
                            <template v-if="nextMove.moveValue === 'draw' || nextMove.remoteness == Remoteness.INFINITY">
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="isPuzzleGame ?
                                        gridRight - currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth :
                                        currentValuedRounds[currentValuedRoundId].position.positionValue === 'win' ?
                                        (turn(currentValuedRoundId) === 1 ?
                                        gridLeft + currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth :
                                        gridRight - currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth) :
                                        turn(currentValuedRoundId) === 1 ?
                                        gridRight - currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth :
                                        gridLeft + currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :y2="gridTop + currentValuedRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else-if="nextMove.moveValue === 'tie'">
                                <line v-if="!isPuzzleGame"
                                    :class="`${nextMove.moveValue} link`"
                                    :x1="isPuzzleGame ?
                                        gridRight - currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth :
                                        currentValuedRounds[currentValuedRoundId].position.positionValue === 'win' ?
                                        (turn(currentValuedRoundId) === 1 ?
                                        gridLeft + currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth :
                                        gridRight - currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth) :
                                        turn(currentValuedRoundId) === 1 ?
                                        gridRight - currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth :
                                        gridLeft + currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    :x2="gridLeft + nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentValuedRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="isPuzzleGame ?
                                        gridRight - currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth :
                                        currentValuedRounds[currentValuedRoundId].position.positionValue === 'win' ?
                                        (turn(currentValuedRoundId) === 1 ?
                                        gridLeft + currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth :
                                        gridRight - currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth) :
                                        turn(currentValuedRoundId) === 1 ?
                                        gridRight - currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth :
                                        gridLeft + currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    :x2="gridRight - nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentValuedRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                            <template v-else>
                                <line :class="`${nextMove.moveValue} link`"
                                    :x1="isPuzzleGame ?
                                        gridRight - currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth :
                                        currentValuedRounds[currentValuedRoundId].position.positionValue === 'win' ?
                                        (turn(currentValuedRoundId) === 1 ?
                                        gridLeft + currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth :
                                        gridRight - currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth) :
                                        turn(currentValuedRoundId) === 1 ?
                                        gridRight - currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth :
                                        gridLeft + currentValuedRounds[currentValuedRoundId].position.remoteness * columnWidth"
                                    :y1="gridTop + currentValuedRoundId * rowHeight - rowHeight / 2"
                                    :x2="isPuzzleGame ?
                                        gridRight - nextMove.remoteness * columnWidth :
                                        nextMove.moveValue === 'win' ?
                                        (turn(currentValuedRoundId) === 1 ?
                                        gridLeft + nextMove.remoteness * columnWidth :
                                        gridRight - nextMove.remoteness * columnWidth) :
                                        turn(currentValuedRoundId) === 1 ?
                                        gridRight - nextMove.remoteness * columnWidth :
                                        gridLeft + nextMove.remoteness * columnWidth"
                                    :y2="gridTop + currentValuedRoundId * rowHeight + rowHeight / 2"
                                    :stroke-width="linkWidth" />
                            </template>
                        </template>
                    </template>
                </template>

                <!-- Next Moves' Position Values -->
                <template v-if="showNextMoves && currentValuedRoundId >= 1">
                    <template v-for="roundNumber in currentValuedRoundId" :key="roundNumber">
                        <template v-for="nextMove in currentValuedRounds[roundNumber].position.availableMoves"
                                :key="nextMove.move">
                            <template v-if="nextMove.moveValue === 'draw' || nextMove.remoteness == Remoteness.INFINITY">
                                <circle :class="[roundNumber === currentValuedRoundId ? 'clickable' : '',
                                                 showNextMoveHints ? nextMove.positionValue : '']"
                                    class="next-move-position-value"
                                    :cx="isPuzzleGame ? gridLeft : chartWidth / 2"
                                    :cy="gridTop + roundNumber * rowHeight + rowHeight / 2"
                                    :r="nextMovePositionValueSize"
                                    :stroke-width="4 * nextMovePositionValueSize"
                                    @click="roundNumber === currentValuedRoundId &&
                                        store.dispatch(actionTypes.runMove, { move: nextMove.move })" />
                            </template>
                            <template v-else-if="nextMove.moveValue === 'tie'">
                                <circle v-if="!isPuzzleGame"
                                    :class="{ clickable: roundNumber === currentValuedRoundId, tie: showNextMoveHints }"
                                    class="next-move-position-value"
                                    :cx="gridLeft + nextMove.remoteness * columnWidth"
                                    :cy="gridTop + roundNumber * rowHeight + rowHeight / 2"
                                    :r="nextMovePositionValueSize"
                                    :stroke-width="4 * nextMovePositionValueSize"
                                    @click="roundNumber === currentValuedRoundId &&
                                        store.dispatch(actionTypes.runMove, { move: nextMove.move })" />
                                <circle :class="{ clickable: roundNumber === currentValuedRoundId, tie: showNextMoveHints }"
                                    class="next-move-position-value"
                                    :cx="gridRight - nextMove.remoteness * columnWidth"
                                    :cy="gridTop + roundNumber * rowHeight + rowHeight / 2"
                                    :r="nextMovePositionValueSize"
                                    :stroke-width="4 * nextMovePositionValueSize"
                                    @click="roundNumber === currentValuedRoundId &&
                                        store.dispatch(actionTypes.runMove, { move: nextMove.move })" />
                            </template>
                            <template v-else>
                                <circle :class="[roundNumber === currentValuedRoundId ? 'clickable' : '',
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
                                    @click="roundNumber === currentValuedRoundId && store.dispatch(actionTypes.runMove, { move: nextMove.move })" />
                            </template>
                        </template>
                    </template>
                </template>
                
                <!-- Position Values -->
                <template v-if="currentValuedRoundId >= 1">
                    <template v-for="roundNumber in currentValuedRoundId" :key="roundNumber">
                        <template v-if="currentValuedRounds[roundNumber].position.positionValue === 'draw' || currentValuedRounds[roundNumber].position.remoteness == Remoteness.INFINITY">
                            <circle :class="(roundNumber !== currentValuedRoundId ? 'clickable' : '') + ' ' + currentValuedRounds[roundNumber].position.positionValue + ' position-value'"
                                :cx="isPuzzleGame ? gridLeft : chartWidth / 2"
                                :cy="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                :r="positionValueSize"
                                :stroke-width="4 * positionValueSize"
                                @click="roundNumber !== currentValuedRoundId &&
                                    store.dispatch(actionTypes.undoMove, {
                                        toRoundId: currentValuedRounds[roundNumber].id
                                    })" />
                        </template>
                        <template v-else-if="currentValuedRounds[roundNumber].position.positionValue === 'tie'">
                            <circle v-if="!isPuzzleGame"
                                :class="roundNumber !== currentValuedRoundId ? 'clickable' : ''"
                                class="tie position-value"
                                :cx="gridLeft + currentValuedRounds[roundNumber].position.remoteness * columnWidth"
                                :cy="gridTop + roundNumber * rowHeight - rowHeight / 2" :r="positionValueSize"
                                :stroke-width="4 * positionValueSize"
                                @click="roundNumber !== currentValuedRoundId &&
                                    store.dispatch(actionTypes.undoMove, {
                                        toRoundId: currentValuedRounds[roundNumber].id
                                    })" />
                            <line v-if="!isPuzzleGame"
                                :class="roundNumber !== currentValuedRoundId ? 'clickable' : ''"
                                class="tie position-value link"
                                :x1="gridLeft + currentValuedRounds[roundNumber].position.remoteness * columnWidth"
                                :y1="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                :x2="gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth"
                                :y2="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                :stroke-width="linkWidth"
                                @click="roundNumber !== currentValuedRoundId &&
                                    store.dispatch(actionTypes.undoMove, {
                                        toRoundId: currentValuedRounds[roundNumber].id
                                    })" />
                            <circle :class="roundNumber !== currentValuedRoundId ? 'clickable' : ''"
                                class="tie position-value"
                                :cx="gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth"
                                :cy="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                :r="positionValueSize"
                                :stroke-width="4 * positionValueSize"
                                @click="roundNumber !== currentValuedRoundId &&
                                    store.dispatch(actionTypes.undoMove, {
                                        toRoundId: currentValuedRounds[roundNumber].id
                                    })" />
                        </template>
                        <template v-else>
                            <circle :class="[roundNumber !== currentValuedRoundId ?
                                    'clickable' :
                                    '', currentValuedRounds[roundNumber].position.positionValue]"
                                class="position-value"
                                :cx="isPuzzleGame ?
                                    gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth :
                                    currentValuedRounds[roundNumber].position.positionValue === 'win' ?
                                    (turn(roundNumber) === 1 ?
                                    gridLeft + currentValuedRounds[roundNumber].position.remoteness * columnWidth :
                                    gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth) :
                                    turn(roundNumber) === 1 ?
                                    gridRight - currentValuedRounds[roundNumber].position.remoteness * columnWidth :
                                    gridLeft + currentValuedRounds[roundNumber].position.remoteness * columnWidth"
                                :cy="gridTop + roundNumber * rowHeight - rowHeight / 2"
                                :r="positionValueSize"
                                :stroke-width="4 * positionValueSize"
                                @click="roundNumber !== currentValuedRoundId &&
                                    store.dispatch(actionTypes.undoMove, {
                                        toRoundId: currentValuedRounds[roundNumber].id
                                    })" />
                        </template>
                    </template>
                </template>
            </svg>
            <p id="right-y-axis-label" v-if="toggleGuides && !isPuzzleGame">
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
                <VueSlider v-model="xInterval" :min="1" :max="maximumRemoteness" :tooltip="'active'" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref } from "vue";
    import { actionTypes, useStore } from "../../../scripts/plugins/store";
    import { Rounds } from "../../../scripts/gamesmanUni/types";
    import * as Remoteness from "../../../scripts/gamesmanUni/remoteness";
    import VueSlider from "vue-slider-component";
    import "vue-slider-component/theme/default.css";

    defineProps({
        viewOptions: Boolean,
        toggleScrolling: Boolean,
        toggleGuides: Boolean,
        toggleSideBranchExploration: Boolean,
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
    const finiteUnknownRemotenessExists = computed(() => detectFiniteUnknownRemoteness.value[1]);

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
    const columnCount = computed(() => (isPuzzleGame.value ? 1 : 2) * ((maximumRemoteness.value + (finiteUnknownRemotenessExists.value ? 1 : 0) + 1)));
    const gridWidth = computed(() => chartWidth.value - 2 * yCoordinateWidth.value);
    const columnWidth = computed(() => gridWidth.value / columnCount.value);
    const gridLeft = computed(() => yCoordinateWidth.value);
    const gridRight = computed(() => chartWidth.value - gridLeft.value);
    const gridCenter = computed(() => chartWidth.value/2);

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
</script>

<style lang="scss" scoped>
    #app-game-vvh-body-remotenessview {
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
                > .view-coordinate {
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
                > .view-bar,
                > .view-interval-bar {
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