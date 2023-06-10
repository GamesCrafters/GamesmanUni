<template>
    <svg v-if="richPositionData.validRichPosition" id="custom-gui-quarto" viewBox="-2 -2 104 128" xmlns="http://www.w3.org/2000/svg" :data-turn="richPositionData.turn">
        <defs>
            <path id="rA" d="M-5.5 0 a 5.5,5.5 0 1,0 11,0 a 5.5,5.5 0 1,0 -11,0 M-2.5 0 a 2.5,2.5 0 1,0 5,0 a 2.5,2.5 0 1,0 -5,0" stroke="black" stroke-width="0.5" fill="black" fill-rule="evenodd"/>
            <path id="rB" d="M-11 0 a 11,11 0 1,0 22,0 a 11,11 0 1,0 -22,0 M-5 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0" stroke="black" stroke-width="0.5" fill="black" fill-rule="evenodd"/>
            <circle id="rC" r="5.5" stroke="black" stroke-width="0.5" fill="black" />
            <circle id="rD" r="11" stroke="black" stroke-width="0.5" fill="black" />
            <path id="rE" d="M-5.5 -5.5 h11 v11 h-11 z M-2.5 -2.5 h5 v5 h-5 z" stroke="black" stroke-width="0.5" fill="black" fill-rule="evenodd"/>
            <path id="rF" d="M-11 -11 h22 v22 h-22 z M-5 -5 h10 v10 h-10 z" stroke="black" stroke-width="0.5" fill="black" fill-rule="evenodd"/>
            <rect id="rG" x="-5.5" y="-5.5" width="11" height="11" stroke="black" stroke-width="0.5" fill="black" />
            <rect id="rH" x="-11" y="-11" width="22" height="22" stroke="black" stroke-width="0.5" fill="black" />
            <path id="rI" d="M-5.5 0 a 5.5,5.5 0 1,0 11,0 a 5.5,5.5 0 1,0 -11,0 M-2.5 0 a 2.5,2.5 0 1,0 5,0 a 2.5,2.5 0 1,0 -5,0" stroke="black" stroke-width="0.5" fill="white" fill-rule="evenodd"/>
            <path id="rJ" d="M-11 0 a 11,11 0 1,0 22,0 a 11,11 0 1,0 -22,0 M-5 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0" stroke="black" stroke-width="0.5" fill="white" fill-rule="evenodd"/>
            <circle id="rK" r="5.5" stroke="black" stroke-width="0.5" fill="white" />
            <circle id="rL" r="11" stroke="black" stroke-width="0.5" fill="white" />
            <path id="rM" d="M-5.5 -5.5 h11 v11 h-11 z M-2.5 -2.5 h5 v5 h-5 z" stroke="black" stroke-width="0.5" fill="white" fill-rule="evenodd"/>
            <path id="rN" d="M-11 -11 h22 v22 h-22 z M-5 -5 h10 v10 h-10 z" stroke="black" stroke-width="0.5" fill="white" fill-rule="evenodd"/>
            <rect id="rO" x="-5.5" y="-5.5" width="11" height="11" stroke="black" stroke-width="0.5" fill="white" />
            <rect id="rP" x="-11" y="-11" width="22" height="22" stroke="black" stroke-width="0.5" fill="white" />

            <g id="bA"><text y="-1" class="nibble-piece">00</text><text y="8" class="nibble-piece">00</text></g>
            <g id="bB"><text y="-1" class="nibble-piece">00</text><text y="8" class="nibble-piece">01</text></g>
            <g id="bC"><text y="-1" class="nibble-piece">00</text><text y="8" class="nibble-piece">10</text></g>
            <g id="bD"><text y="-1" class="nibble-piece">00</text><text y="8" class="nibble-piece">11</text></g>
            <g id="bE"><text y="-1" class="nibble-piece">01</text><text y="8" class="nibble-piece">00</text></g>
            <g id="bF"><text y="-1" class="nibble-piece">01</text><text y="8" class="nibble-piece">01</text></g>
            <g id="bG"><text y="-1" class="nibble-piece">01</text><text y="8" class="nibble-piece">10</text></g>
            <g id="bH"><text y="-1" class="nibble-piece">01</text><text y="8" class="nibble-piece">11</text></g>
            <g id="bI"><text y="-1" class="nibble-piece">10</text><text y="8" class="nibble-piece">00</text></g>
            <g id="bJ"><text y="-1" class="nibble-piece">10</text><text y="8" class="nibble-piece">01</text></g>
            <g id="bK"><text y="-1" class="nibble-piece">10</text><text y="8" class="nibble-piece">10</text></g>
            <g id="bL"><text y="-1" class="nibble-piece">10</text><text y="8" class="nibble-piece">11</text></g>
            <g id="bM"><text y="-1" class="nibble-piece">11</text><text y="8" class="nibble-piece">00</text></g>
            <g id="bN"><text y="-1" class="nibble-piece">11</text><text y="8" class="nibble-piece">01</text></g>
            <g id="bO"><text y="-1" class="nibble-piece">11</text><text y="8" class="nibble-piece">10</text></g>
            <g id="bP"><text y="-1" class="nibble-piece">11</text><text y="8" class="nibble-piece">11</text></g>
        </defs>

        <!-- Draw the board. -->
        <path d="M0,0 h100 v100 h-100z M0,25 h100z M0,50 h100z M0,75 h100z M25,0 v100z M50,0 v100z M75,0 v100z" stroke="black" stroke-width="0.5" fill="#888888"/>

        <g v-if="currentPosition==='R_A_17_1_-----------------'">
            <g v-if="!animationPlaying">
                <rect x="2.5" y="2.5" width="95" height="95" rx="4" ry="4" opacity="0.99" fill="#FFFFFF"/>
                <text x="25" y="10" fill="black" class="small">Choose a Piece for the</text>
                <text x="24.5" y="15" fill="black" class="small">Second Player to Place</text>
                
                <!-- Draw move buttons. -->
                <g v-for="(token, i) in richPositionData.tokens" :key="'token' + i"
                    :class="'quarto-move'"
                    :style="'--xorigin: ' + centers[token.to][0] + 'px ' + centers[token.to][1] + 'px'"
                    @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: token.move.str })">
                    <rect width="16" height="16" rx="2" ry="2"
                        :x="centers[token.to][0] - 8" :y="centers[token.to][1] - 8" 
                        :class="'quarto-hint ' + getBoardMoveElementHintClass(token.move)"
                        :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? token.move.hintOpacity : 1"/>
                    <use :href="'#' + gameTheme + token.token"
                        :transform="'translate(' + centers[token.to][0] + ' ' + centers[token.to][1] + ') scale(' + centers[token.to][2] + ')'"/>
                </g>
            </g>
        </g>
        <g v-else>
            <!-- Draw Pieces on Board. -->
            <use v-for="(cell, i) in richPositionData.board" :key="'cell' + i"
                :href="'#' + gameTheme + cell"
                :transform="'translate(' + centers[i][0] + ' ' + centers[i][1] + ')'" />

            <!-- Draw Piece Being Placed. -->
            <use id="toPlace" :href="'#' + gameTheme + richPositionData.nextPiece" transform="translate(58 113)"/>

            <!-- Draw Move Buttons -->
            <g v-if="!animationPlaying">
                <g v-for="(token, i) in richPositionData.tokens" :key="'token' + i"
                    :class="'quarto-move'"
                    :style="'--xorigin: ' + centers[token.to][0] + 'px ' + centers[token.to][1] + 'px'"
                    @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: token.move.str })">
                    <g v-if="token.token != '-'">
                        <rect width="5" height="5" rx="0.5" ry="0.5"
                            :x="centers[token.to][0] - 2.5" :y="centers[token.to][1] - 2.5"
                            :class="'quarto-hint ' + getBoardMoveElementHintClass(token.move)"
                            :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? token.move.hintOpacity : 1"/>
                        <use :href="'#' + gameTheme + token.token"
                            :transform="'translate(' + centers[token.to][0] + ' ' + centers[token.to][1] + ') scale(' + centers[token.to][2] + ')'"/>
                    </g>
                    <rect v-else width="16" height="16" rx="5" ry="5"
                        :x="centers[token.to][0] - 8" :y="centers[token.to][1] - 8" 
                        :class="'quarto-hint ' + getBoardMoveElementHintClass(token.move)"
                        :opacity="options.showNextMoveHints && options.showNextMoveDeltaRemotenesses ? token.move.hintOpacity : 1"/>
                </g>
            </g>
        </g> 

        <text x="83.5" y="107" style="stroke:black;fill:black" class="verysmall">Nibble</text>
        <text x="77.5" y="110" style="stroke:black;fill:black" class="verysmall">Representation</text>

        <!-- Toggle Binary/Real Pieces -->
        <g style="--xorigin: 87.5px 117px" class="quarto-move"
            @click="store.dispatch(actionTypes.updateGameTheme, { gameTheme: otherGameTheme })" >
            <g v-if="gameTheme==='b'">
                <rect x="80.5" y="113" width="14" height="8" rx="3" ry="5" fill="#7F00FF" />
                <text x="85.5" y="118" style="stroke:white;fill:white" class="verysmall">On</text> 
            </g>
            <g v-else>
                <rect x="80.5" y="113" width="14" height="8" rx="3" ry="5" fill="#CBC3E3" />
                <text x="85.5" y="118" style="stroke:white;fill:white" class="verysmall">Off</text> 
            </g>
        </g>

        <g v-if="isPlacing && !animationPlaying">
            <text x="0" y="116.5" style="stroke:black;stroke-width:0.5;fill:black" class="big">Placing:</text>
        </g>
    </svg>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import gsap from "gsap";
    import { actionTypes, useStore } from "../../../scripts/plugins/store";

    interface GDefaultRegular2DMove {
        str: string; // UWAPI move string
        hint: string;
        hintOpacity: number;
    }

    interface GDefaultRegular2DBoardToken {
        token: string;
        to: number;
        move: GDefaultRegular2DMove;
    }

    const store = useStore();
    const options = computed(() => store.getters.options);
    const currentPosition = computed(() => store.getters.currentPosition);
    const isComputerTurn = computed(() => store.getters.currentPlayer.isComputer);
    const availableMoves = computed(() => store.getters.currentAvailableMoves);
    const isPlacing = computed(() => currentPosition.value.slice(-1) != "-");
    const gameTheme = computed(() => store.getters.currentGameTheme || "r");
    const otherGameTheme = computed(() => gameTheme.value === "r" ? "b" : "r");
    const animationPlaying = computed(() => store.getters.animationPlaying);
    const richPositionData = computed(() => {
        const matches = currentPosition.value.match(/^R_(A|B)_([0-9]+)_([0-9]+)_([a-zA-Z0-9-\*]+)*/)!;
        const validRichPosition = matches && matches.length >= 5 && matches[4].length == 17;
        if (validRichPosition) {
            gsap.to("#toPlace", {duration: 0.01, x: 58, y: 113});
            const board = matches[4].substring(0, 16);
            let tokens: GDefaultRegular2DBoardToken[] = [];
            const nextPiece = matches[4].slice(-1);
            for (let nextMoveData of Object.values(availableMoves.value)) {        
                let matches;
                if ((matches = nextMoveData.move.match(/^A_([a-zA-Z0-9-\*])_([0-9]+)*/))) {
                    tokens.push({
                        token: matches[1],
                        to: parseInt(matches[2]),
                        move: {
                            str: nextMoveData.move,
                            hint: nextMoveData.moveValue,
                            hintOpacity: nextMoveData.moveValueOpacity
                        },
                    });
                }
            }

            return {
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

    const centers = computed(() => {
        let lst: number[][] = [];
        for (var i = 0; i < 300; i++) {
            if (i < 16) { 
                lst.push([12.5 + (i % 4) * 25, 12.5 + Math.floor(i / 4) * 25, 1]);
            } else if (i < 272) {
                const j = Math.floor((i - 16) / 16);
                const k = i - 16 * (j + 1);
                lst.push([25 * (j % 4) + 3.125 + 6.25 * (k % 4), 25 * Math.floor(j / 4) + 3.125 + 6.25 * Math.floor(k / 4), 0.18]);
            } else {
                const k = i - 272;
                lst.push([20 + (k % 4) * 20, 27 + Math.floor(k / 4) * 20, 0.5]);
            }
        }
        return lst;
    });
    
</script>

<style lang="scss" scoped>
    #custom-gui-quarto {
        height: 100%;
        width: 100%;
    }
    
    .verysmall {
        font: 3px sans-serif;
        stroke-width: 0.15;
    }

    .small {
        font: 5px sans-serif;
    }

    .big {
        font: 12px sans-serif;
    }

    @keyframes pulsing-token {
        0% { transform: scale(1); }
        100% { transform: scale(1.1); }
  }

  .nibble-piece {
    text-anchor: middle;
    font-family: "Courier New", monospace;
    stroke: black;
    stroke-width: 0.5;
    fill: black;
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
    fill: var(--primaryColor);

    [data-turn="A"] & {
      fill: var(--turn1Color);
    }
    [data-turn="B"] & {
      fill: var(--turn2Color);
    }

    &.hint- {
      &win {
        fill: var(--winColor);
      }
      &tie {
        fill: var(--tieColor);
      }
      &lose {
        fill: var(--loseColor);
      }
    }
  }

</style>
