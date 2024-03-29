<template>
    <svg id="custom-gui-tictactoe" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <!-- Draw three-in-a-row highlighters. -->
        <g :class="'highlighter' + isMisere" v-if="currentRemoteness == 0">
            <rect v-if="triplets[0] || triplets[3] || triplets[6]" x="1" y="1" width="20" height="20"/>
            <rect v-if="triplets[0] || triplets[4]" x="23" y="1" width="20" height="20"/>
            <rect v-if="triplets[0] || triplets[5] || triplets[7]" x="45" y="1" width="20" height="20"/>
            <rect v-if="triplets[1] || triplets[3]" x="1" y="23" width="20" height="20"/>
            <rect v-if="triplets[1] || triplets[4] || triplets[6] || triplets[7]" x="23" y="23" width="20" height="20"/>
            <rect v-if="triplets[1] || triplets[5]" x="45" y="23" width="20" height="20"/>
            <rect v-if="triplets[2] || triplets[3] || triplets[7]" x="1" y="45" width="20" height="20"/>
            <rect v-if="triplets[2] || triplets[4]" x="23" y="45" width="20" height="20"/>
            <rect v-if="triplets[2] || triplets[5] || triplets[6]" x="45" y="45" width="20" height="20"/>
        </g>

        <!-- Draw board -->
        <line x1="1" y1="22" x2="65" y2="22"/>
        <line x1="1" y1="44" x2="65" y2="44"/>
        <line x1="22" y1="1" x2="22" y2="65"/>
        <line x1="44" y1="1" x2="44" y2="65"/>

        <g v-for="(_, cell) in 9" :key="cell">
            <line :id="'xa' + cell" stroke="var(--turn1Color)" :x1="3 + xOffset(cell)" :y1="3 + yOffset(cell)" :x2="3 + xOffset(cell) + b16(board[cell].mark === 'x')" :y2="3 + yOffset(cell) + b16(board[cell].mark === 'x')"/>
            <line :id="'xb' + cell" stroke="var(--turn1Color)" :x1="19 + xOffset(cell)" :y1="3 + yOffset(cell)" :x2="19 + xOffset(cell) - b16(board[cell].mark === 'x')" :y2="3 + yOffset(cell) + b16(board[cell].mark === 'x')"/>
            <circle :id="'o' + cell" :transform="'rotate(-90 ' + (11 + xOffset(cell)) + ' ' + (11 + yOffset(cell)) + ')'" stroke="var(--turn2Color)" r="8" :cx="11 + xOffset(cell)" :cy="11 + yOffset(cell)" :stroke-dasharray="51" :stroke-dashoffset="board[cell].mark === 'o' ? 0 : 51"/>

            <g :class="movesAreClickable ? 'button' : ''" v-if="!animationPlaying && currentRemoteness > 0 && board[cell].mark === '-'">
                <circle v-if="showNextMoves && board[cell].hint"
                    r="3" :cx="11 + xOffset(cell)" :cy="11 + yOffset(cell)"
                    :class="getHintClass(board[cell].hint)"
                    :opacity="showNextMoveDeltaRemotenesses ? board[cell].hintOpacity : 1"/>
                <rect v-if="currentRemoteness && movesAreClickable"
                    cursor="pointer" fill="var(--backgroundColor)"
                    @click="movesAreClickable && store.dispatch(actionTypes.runMove, { autoguiMove: board[cell].move })"
                    width="20" height="20" fill-opacity="0" stroke-opacity="0"
                    :x="1 + xOffset(cell)" :y="1 + yOffset(cell)"
                />
                <title>{{ moveButtonTitle(board[cell].move) }}</title>
            </g>
        </g>
    </svg>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { actionTypes, useStore } from "../../../scripts/plugins/store";
    type CellData = { mark: string; move: string; hint: string; hintOpacity: number };
    type BoardData = Record<number, CellData>;
    const store = useStore();
    const options = computed(() => store.getters.options);
    const showNextMoves = computed(() => (options.value ? options.value.showNextMoves : true));
    const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));
    const showNextMoveDeltaRemotenesses = computed(() => (options.value ? options.value.showNextMoveDeltaRemotenesses : true));
    const currentPosition = computed(() => store.getters.currentPosition);
    const currentRemoteness = computed(() => store.getters.currentRemoteness);
    const availableMoves = computed(() => store.getters.currentAvailableMoves);
    const movesAreClickable = computed(() => !(store.getters.currentPlayer.isComputer || (options.value.automoveIfSingleMove && Object.keys(availableMoves.value).length == 1)));
    const turn = computed(() => currentPosition.value[0]);
    const animationPlaying = computed(() => store.getters.animationPlaying);
    const isMisere = computed(() => store.getters.currentVariantId === "misere" ? "misere" : "");
    const board = computed(() => {
        let board: BoardData = {};
        for (let cell: number = 0; cell < 9; cell++) board[cell] = { mark: currentPosition.value[2 + cell], move: "", hint: "", hintOpacity: 1 };
        for (let availableMove in availableMoves.value) Object.assign(board[+availableMoves.value[availableMove].autoguiMove[4]], { move: availableMoves.value[availableMove].autoguiMove, hint: availableMoves.value[availableMove].moveValue, hintOpacity: availableMoves.value[availableMove].moveValueOpacity });
        return board;
    });
    const getHintClass = (hint: string): string => (showNextMoveHints.value ? "hint-" + hint : "hint-" + turn.value);
    const xOffset = (cell: number): number => (cell % 3) * 22;
    const yOffset = (cell: number): number => Math.floor(cell / 3) * 22;
    const b16 = (cond: boolean): number => cond ? 16 : 0;
    const triplets = computed(() => {
        const str = currentPosition.value.split('_')[1];
        return [
            str[0] != '-' && str[0] == str[1] && str[1] == str[2],
            str[3] != '-' && str[3] == str[4] && str[4] == str[5],
            str[6] != '-' && str[6] == str[7] && str[7] == str[8],
            str[0] != '-' && str[0] == str[3] && str[3] == str[6],
            str[1] != '-' && str[1] == str[4] && str[4] == str[7],
            str[2] != '-' && str[2] == str[5] && str[5] == str[8],
            str[0] != '-' && str[0] == str[4] && str[4] == str[8],
            str[2] != '-' && str[2] == str[4] && str[4] == str[6]
        ]
    });

    const moveButtonTitle = (moveStr: string): string => {
        var moveObj = availableMoves.value[moveStr];
        var value = moveObj.moveValue[0].toUpperCase() + moveObj.moveValue.substring(1);
        return options.value.showNextMoveHints ? (value + " in " + moveObj.remoteness) : "";
    }
</script>

<style lang="scss" scoped>
    #custom-gui-tictactoe {
        height: 100%;
        width: 100%;
        > * {
            fill: none;
            stroke-width: 2;
            stroke: var(--neutralColor);
        }
        .hint- {
            &1 {
                stroke: var(--turn1Color);
                fill: var(--turn1Color);
            }
            &2 {
                stroke: var(--turn2Color);
                fill: var(--turn2Color);
            }
            &win {
                stroke: var(--winColor);
                fill: var(--winColor);
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

        .highlighter rect {
            stroke-width: 0;
            fill: rgb(153, 223, 153);
        }

        .highlightermisere rect {
            stroke-width: 0;
            fill: rgb(255, 138, 125);
        }

        @keyframes pulsing-token {
            0% { r: 3; }
            100% { r: 4; }
        }

        .button:hover circle {
            animation-name: pulsing-token;
            animation-duration: 0.3s;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            animation-direction: alternate;
        }
    }
</style>
