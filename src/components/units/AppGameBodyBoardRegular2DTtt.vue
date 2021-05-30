<template>
    <svg id="app-game-body-board-regular-2d-ttt" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <g id="board">
                <path id="bar" d="M1,22 L65,22" />
                <use href="#bar" transform="translate(0 22)" />
                <use href="#bar" transform="translate(44) rotate(90)" />
                <use href="#bar" transform="translate(66) rotate(90)" />
            </g>
            <g id="x-token">
                <path id="cross-bar" d="M3,3 L19,19" />
                <use href="#cross-bar" transform="translate(22) rotate(90)" />
            </g>
            <circle id="o-token" cx="11" cy="11" r="8" />
            <circle id="hint" cx="11" cy="11" r="1" />
            <rect id="available-move-cell" x="1" y="1" width="20" height="20" />
        </defs>
        <use href="#board" x="0" y="0" />
        <g v-for="cell in cellCount" :key="cell">
            <use v-if="board[cell].token === 'x'" href="#x-token" :x="((cell - 1) % 3) * 22" :y="Math.floor((cell - 1) / 3) * 22" />
            <use v-else-if="board[cell].token === 'o'" href="#o-token" :x="((cell - 1) % 3) * 22" :y="Math.floor((cell - 1) / 3) * 22" />
            <g v-else>
                <use v-if="showNextMoves && board[cell].hint" :class="getHintClass(board[cell].hint)" :style="{ opacity: showNextMoveDeltaRemotenesses ? board[cell].hintOpacity : 1 }" href="#hint" :x="((cell - 1) % 3) * 22" :y="Math.floor((cell - 1) / 3) * 22" />
                <use :class="currentRemoteness && !isComputerTurn && 'available-move-pointer'" @click="!isComputerTurn && currentRemoteness && store.dispatch(actionTypes.runMove, { move: board[cell].move })" href="#available-move-cell" :x="((cell - 1) % 3) * 22" :y="Math.floor((cell - 1) / 3) * 22" />
            </g>
        </g>
    </svg>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { actionTypes, useStore } from "../../scripts/plugins/store";

    type CellData = { token: string; move: string; hint: string; hintOpacity: number };
    type BoardData = Record<number, CellData>;
    const store = useStore();
    const options = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.options : undefined));
    const showNextMoves = computed(() => (options.value ? options.value.showNextMoves : true));
    const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));
    const showNextMoveDeltaRemotenesses = computed(() => (options.value ? options.value.showNextMoveDeltaRemotenesses : true));
    const currentPosition = computed(() => store.getters.currentPosition);
    const currentRemoteness = computed(() => store.getters.currentRemoteness);
    const isComputerTurn = computed(() => store.getters.currentPlayer.id[0] === "c");
    const availableMoves = computed(() => store.getters.currentAvailableMoves);
    const cellCount = 9;
    const board = computed(() => {
        let board: BoardData = {};
        for (let cell: number = 1; cell <= cellCount; cell++) board[cell] = { token: currentPosition.value[7 + cell], move: "", hint: "", hintOpacity: 1 };
        for (let availableMove in availableMoves.value) Object.assign(board[+availableMoves.value[availableMove].move[4] + 1], { move: availableMoves.value[availableMove].move, hint: availableMoves.value[availableMove].moveValue, hintOpacity: availableMoves.value[availableMove].moveValueOpacity });
        return board;
    });
    const getHintClass = (hint: string): string => (showNextMoveHints.value ? "hint-" + hint : "");
</script>

<style lang="scss" scoped>
    #app-game-body-board-regular-2d-ttt {
        height: 100%;
        width: 100%;
        > * {
            fill: none;
            stroke-width: 2;
            stroke: var(--neutralColor);
        }
        #x-token {
            stroke: var(--turn1Color);
        }
        #o-token {
            stroke: var(--turn2Color);
        }
        .hint- {
            &win {
                stroke: var(--winColor);
            }
            &draw {
                stroke: var(--drawColor);
            }
            &tie {
                stroke: var(--tieColor);
            }
            &lose {
                stroke: var(--loseColor);
            }
        }
        #available-move-cell {
            fill-opacity: 0;
            fill: var(--backgroundColor);
            stroke-opacity: 0;
        }
        .available-move-pointer {
            cursor: pointer;
        }
    }
</style>
