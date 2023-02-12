<template>
    <svg id="app-game-body-board-regular-2d-quarto" viewBox="-2 -2 104 128" xmlns="http://www.w3.org/2000/svg"
    :data-turn="richPositionData.turn">
        <defs>
            <g id="rA">
                <circle r="5" stroke="black" stroke-width="4" fill="none" />
            </g>
            <g id="rB">
                <circle r="8" stroke="black" stroke-width="6" fill="none" />
            </g>
            <g id="rC">
                <circle r="5" stroke="black" stroke-width="4" fill="black" />
            </g>
            <g id="rD">
                <circle r="8" stroke="black" stroke-width="6" fill="black" />
            </g>

            <g id="rE">
                <rect x="-5" y="-5" width="10" height="10" stroke="black" stroke-width="4" fill="none" />
            </g>
            <g id="rF">
                <rect x="-8" y="-8" width="16" height="16" stroke="black" stroke-width="6" fill="none" />
            </g>
            <g id="rG">
                <rect x="-5" y="-5" width="10" height="10" stroke="black" stroke-width="4" fill="black" />
            </g>
            <g id="rH">
                <rect x="-8" y="-8" width="16" height="16" stroke="black" stroke-width="6" fill="black" />
            </g>

            <g id="rI">
                <circle r="5" stroke="black" stroke-width="4" fill="none" />
                <circle r="5" stroke="white" stroke-width="3" fill="none" />
            </g>
            <g id="rJ">
                <circle r="8" stroke="black" stroke-width="6" fill="none" />
                <circle r="8" stroke="white" stroke-width="5" fill="none" />
            </g>
            <g id="rK">
                <circle r="5" stroke="black" stroke-width="4" fill="none" />
                <circle r="5" stroke="white" stroke-width="3" fill="white" />
            </g>
            <g id="rL">
                <circle r="8" stroke="black" stroke-width="6" fill="none" />
                <circle r="8" stroke="white" stroke-width="5" fill="white" />
            </g>

            <g id="rM">
                <rect x="-5" y="-5" width="10" height="10" stroke="black" stroke-width="4" fill="none" />
                <rect x="-5" y="-5" width="10" height="10" stroke="white" stroke-width="3" fill="none" />
            </g>
            <g id="rN">
                <rect x="-8" y="-8" width="16" height="16" stroke="black" stroke-width="6" fill="none" />
                <rect x="-8" y="-8" width="16" height="16" stroke="white" stroke-width="5" fill="none" />
            </g>
            <g id="rO">
                <rect x="-5" y="-5" width="10" height="10" stroke="black" stroke-width="4" fill="white" />
                <rect x="-5" y="-5" width="10" height="10" stroke="white" stroke-width="3" fill="white" />
            </g>
            <g id="rP">
                <rect x="-8" y="-8" width="16" height="16" stroke="black" stroke-width="6" fill="white" />
                <rect x="-8" y="-8" width="16" height="16" stroke="white" stroke-width="5" fill="white" />
            </g>

            <g id="bA">
                <text y="-1" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">00</text>
                <text y="8" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">00</text>
            </g>
            <g id="bB">
                <text y="-1" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">00</text>
                <text y="8" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">01</text>
            </g>
            <g id="bC">
                <text y="-1" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">00</text>
                <text y="8" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">10</text>
            </g>
            <g id="bD">
                <text y="-1" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">00</text>
                <text y="8" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">11</text>
            </g>
            <g id="bE">
                <text y="-1" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">01</text>
                <text y="8" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">00</text>
            </g>
            <g id="bF">
                <text y="-1" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">01</text>
                <text y="8" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">01</text>
            </g>
            <g id="bG">
                <text y="-1" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">01</text>
                <text y="8" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">10</text>
            </g>
            <g id="bH">
                <text y="-1" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">01</text>
                <text y="8" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">11</text>
            </g>
            <g id="bI">
                <text y="-1" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">10</text>
                <text y="8" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">00</text>
            </g>
            <g id="bJ">
                <text y="-1" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">10</text>
                <text y="8" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">01</text>
            </g>
            <g id="bK">
                <text y="-1" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">10</text>
                <text y="8" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">10</text>
            </g>
            <g id="bL">
                <text y="-1" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">10</text>
                <text y="8" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">11</text>
            </g>
            <g id="bM">
                <text y="-1" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">11</text>
                <text y="8" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">00</text>
            </g>
            <g id="bN">
                <text y="-1" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">11</text>
                <text y="8" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">01</text>
            </g>
            <g id="bO">
                <text y="-1" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">11</text>
                <text y="8" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">10</text>
            </g>
            <g id="bP">
                <text y="-1" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">11</text>
                <text y="8" text-anchor="middle" font-family="monospace" style="stroke:black;stroke-width:0.5;fill:black">11</text>
            </g>

            <circle id="hinter" r="7" />
            <rect id="available-move-cell" x="1" y="1" width="20" height="20" />
        </defs>

        <rect x="0" y="0" width="100" height="100" style="fill:#888888;stroke:black;stroke-width:0.5"/>
        <line x1="0" y1="25" x2="100" y2="25" style="stroke:black;stroke-width:0.5"/>
        <line x1="0" y1="50" x2="100" y2="50" style="stroke:black;stroke-width:0.5"/>
        <line x1="0" y1="75" x2="100" y2="75" style="stroke:black;stroke-width:0.5"/>
        <line x1="25" y1="0" x2="25" y2="100" style="stroke:black;stroke-width:0.5"/>
        <line x1="50" y1="0" x2="50" y2="100" style="stroke:black;stroke-width:0.5"/>
        <line x1="75" y1="0" x2="75" y2="100" style="stroke:black;stroke-width:0.5"/>

        <g v-if=isInitial>
            <rect x="2.5" y="2.5" width="95" height="95" rx="4" ry="4" opacity="0.99" style="fill:#FFFFFF;stroke:none"/>
            <text x="25" y="10" style="stroke:none;fill:black" class="small">Choose a Piece for the</text>
            <text x="24.5" y="15" style="stroke:none;fill:black" class="small">Second Player to Place</text>
            
            <!-- Draw the moves-->
            <g v-for="(token, i) in richPositionData.tokens" 
                :key="'token' + i"
                :set="(coords = calcTranslateAndScale(token.to))"
                :class="'quarto-move'"
                :style="'--xorigin: ' + coords[0] + 'px ' + coords[1] + 'px'"
                @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: token.move.str })">
                <!-- If no move token specified, use default move token (a circle). -->
                <rect
                    :x="coords[0] - 7"
                    :y="coords[1] - 7" 
                    :width="14"
                    :height="14"
                    :rx="2"
                    :ry="2"
                    :class="'quarto-hint ' + getBoardMoveElementHintClass(token.move)"
                    :style="{
                        opacity: options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? token.move.hintOpacity : 1,
                    }"/>
                <use
                    :href="'#' + displayMode + token.token"
                    :transform="'translate(' + coords[0] + ' ' + coords[1] + ') scale(' + coords[2] + ')'"/>
            </g>
        </g>
        <g v-else>
            <!-- Draw Pieces on Board. -->
            <g v-for="(cell, i) in richPositionData.board"
                :key="'cell' + i"
                :set="(coords = calcTranslateAndScale(i))">
                <use 
                    :href="'#' + displayMode + cell.piece"
                    :transform="'translate(' + coords[0] + ' ' + coords[1] + ')'" />
            </g>

            <!-- Draw Piece Being Placed. -->
            <use 
                :href="'#' + displayMode + richPositionData.nextPiece"
                :transform="'translate(58 113)'" />

            <!-- Draw the moves-->
            <g v-for="(token, i) in richPositionData.tokens" 
                :key="'token' + i"
                :set="(coords = calcTranslateAndScale(token.to))"
                :class="'quarto-move'"
                :style="'--xorigin: ' + coords[0] + 'px ' + coords[1] + 'px'"
                @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: token.move.str })">
                <!-- If no move token specified, use default move token (a circle). -->
                <g v-if="token.token != '-'">
                    <rect
                        :x="coords[0] - 2"
                        :y="coords[1] - 2" 
                        :width="4"
                        :height="4"
                        :rx="0.2"
                        :ry="0.2"
                        :class="'quarto-hint ' + getBoardMoveElementHintClass(token.move)"
                        :style="{
                            opacity: options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? token.move.hintOpacity : 1,
                        }"/>
                    <use
                        :href="'#' + displayMode + token.token.toUpperCase()"
                        :transform="'translate(' + coords[0] + ' ' + coords[1] + ') scale(' + coords[2] + ')'"
                        @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: token.move.str })"/>
                </g>
                <g v-else>
                    <rect
                        :x="coords[0] - 7"
                        :y="coords[1] - 7" 
                        :width="14"
                        :height="14"
                        :rx="5"
                        :ry="5"
                        :class="'quarto-hint ' + getBoardMoveElementHintClass(token.move)"
                        :style="{
                            opacity: options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? token.move.hintOpacity : 1,
                        }"/>
                </g>
            </g>

        </g> 

        <!-- Toggle Binary/Real Pieces -->
        <g v-if=isPlacing>
            <text x="0" y="116.5" style="stroke:black;stroke-width:0.5;fill:black" class="big">Placing:</text>
            <line x1="75" y1="101" x2="75" y2="125" stroke="#888888" stroke-width="0.5" />
        </g>
    </svg>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { actionTypes, useStore } from "../../scripts/plugins/store";

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

    const store = useStore();
    const options = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.options : undefined));
    const showNextMoves = computed(() => (options.value ? options.value.showNextMoves : true));
    const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));
    const showNextMoveDeltaRemotenesses = computed(() => (options.value ? options.value.showNextMoveDeltaRemotenesses : true));
    const currentPosition = computed(() => store.getters.currentPosition);
    const currentRemoteness = computed(() => store.getters.currentRemoteness);
    const isComputerTurn = computed(() => store.getters.currentPlayer.id[0] === "c");
    const availableMoves = computed(() => store.getters.currentAvailableMoves);
    const isInitial=computed(() => currentPosition.value==="R_A_17_1_-----------------");
    const isPlacing=computed(() => currentPosition.value.slice(-1) != "-");
    const displayMode = "b";
    const richPositionData = computed(() => {
        const position: string = currentPosition.value;
        const matches = position.match(/^R_(A|B)_([0-9]+)_([0-9]+)_([a-zA-Z0-9-\*]+)*/)!;
        const validRichPosition = matches && matches.length >= 5 && matches[4].length == 17;
        if (validRichPosition) {
            const turn = matches[1] == "A" ? UWAPITurn.A : UWAPITurn.B;
            const board: GDefaultRegular2DBoardCell[] = matches[4].substring(0, 16).split("").map((piece) => ({ piece }));
            let tokens: GDefaultRegular2DBoardToken[] = [];
            const nextPiece = matches[4].slice(-1);
            for (let nextMoveData of Object.values(availableMoves.value)) {        
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
                } else {
                    console.error("NOTREACHED");
                }
            }

            return {
                turn: turn,
                board,
                tokens,
                nextPiece,
                validRichPosition,
            };
        }

        return {
            validRichPosition
        }
    });

    const getBoardMoveElementHintClass = (move?: GDefaultRegular2DMove): string => (move && options.value.showNextMoveHints ? "hint-" + move.hint : "");

    const calcTranslateAndScale = (i: number): [number, number, number] => {
        if (i < 16) { 
            return [12.5 + (i % 4) * 25, 12.5 + Math.floor(i / 4) * 25, 1];
        } else if (i < 272) {
            const j = Math.floor((i - 16) / 16);
            const k = i - 16 * (j + 1);
            return [25 * (j % 4) + 3.125 + 6.25 * (k % 4), 25 * Math.floor(j / 4) + 3.125 + 6.25 * Math.floor(k / 4), 0.20];
        } else {
            const k = i - 272;
            return [20 + (k % 4) * 20, 27 + Math.floor(k / 4) * 20, 0.5];
        }
    };
</script>

<style lang="scss" scoped>
    #app-game-body-board-regular-2d-quarto {
        height: 100%;
        width: 100%;
    }

    .available-move-pointer {
        cursor: pointer;
    }

    .small {
        font:5px sans-serif;
    }

    .big {
        font:12px sans-serif;
    }

    @keyframes pulsing-token {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.1);
    }
  }

  .quarto-move {
    cursor: pointer;
    transform-origin: var(--xorigin);
    
    &:hover {
      animation-name: pulsing-token;
      animation-duration: 0.3s;
      animation-iteration-count: infinite;
      animation-timing-function: ease-in-out;
      animation-direction: alternate;
    }
  }

  .quarto-hint {
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
    }
  }

</style>
