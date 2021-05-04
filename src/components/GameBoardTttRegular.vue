<template>
    <div id="app-game-board-ttt-regular">
        <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <g id="board">
                    <path id="board-bar" d="M1,22 L65,22" />
                    <use href="#board-bar" transform="translate(0 22)" />
                    <use href="#board-bar" transform="translate(44) rotate(90)" />
                    <use href="#board-bar" transform="translate(66) rotate(90)" />
                </g>
                <g id="turn-1-token">
                    <path id="cross-bar" d="M3,3 L19,19" />
                    <use href="#cross-bar" transform="translate(22) rotate(90)" />
                </g>
                <circle id="turn-2-token" cx="11" cy="11" r="8" />
                <circle id="hint" cx="11" cy="11" r="1" />
                <rect id="move" x="1" y="1" width="20" height="20" />
            </defs>
            <use href="#board" x="0" y="0" />
            <g v-for="cell in cellCount" :key="cell">
                <use v-if="board[cell].token === 'x'" href="#turn-1-token" :x="((cell - 1) % 3) * 22" :y="Math.floor((cell - 1) / 3) * 22" />
                <use v-else-if="board[cell].token === 'o'" href="#turn-2-token" :x="((cell - 1) % 3) * 22" :y="Math.floor((cell - 1) / 3) * 22" />
                <g v-else>
                    <use v-if="store.state.app.game.options.showNextMoves && board[cell].hint" :class="getHintClass(board[cell].hint)" :style="{ opacity: store.state.app.game.options.showNextMoveDeltaRemotenesses ? board[cell].hintOpacity : 1 }" href="#hint" :x="((cell - 1) % 3) * 22" :y="Math.floor((cell - 1) / 3) * 22" />
                    <use :class="store.state.app.game.round.remoteness && 'move-pointer'" @click="store.state.app.game.round.remoteness && store.dispatch(actionTypes.runMove, board[cell].move)" href="#move" :x="((cell - 1) % 3) * 22" :y="Math.floor((cell - 1) / 3) * 22" />
                </g>
            </g>
        </svg>
    </div>
</template>

<script lang="ts" setup>
    import { onMounted, ref, watch } from "vue";
    import { actionTypes, useStore } from "../plugins/store";

    type BoardData = { token: string; move: string; hint: string; hintOpacity: number };
    type Board = Record<number, BoardData>;

    const store = useStore();

    const cellCount: number = 9;

    const initiateBoard = (): Board => {
        let board: Board = {};
        for (let cell: number = 1; cell <= cellCount; cell++) board[cell] = { token: "", move: "", hint: "", hintOpacity: 1 };
        return board;
    };

    let board = ref(initiateBoard());

    const updateBoard = (): void => {
        board.value = initiateBoard();
        for (let cell: number = 1; cell <= cellCount; cell++) board.value[cell].token = store.state.app.game.round.position[7 + cell];
        // for (let availableMove of store.state.app.game.round.availableMoves) Object.assign(board[+availableMove.move[4] + 1], { move: availableMove.move, hint: availableMove.moveValue, hintOpacity: availableMove.moveValueOpacity });
    };

    const getHintClass = (hint: string): string => (store.state.app.game.options.showNextMoveHints ? "hint-" + hint : "");

    onMounted(updateBoard);
    watch(
        () => store.state.app.game.round.id,
        () => updateBoard()
    );
</script>

<style lang="scss" scoped>
    svg {
        height: 15em;
        width: 15em;
        margin: auto;
        vertical-align: middle;
        > * {
            fill: none;
            stroke: var(--neutralColor);
            stroke-width: 2;
        }
    }
    #turn- {
        &1-token {
            stroke: var(--turn0Color);
        }
        &2-token {
            stroke: var(--turn1Color);
        }
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
    #move {
        fill: var(--backgroundColor);
        fill-opacity: 0;
        stroke-opacity: 0;
    }
    .move-pointer {
        cursor: pointer;
    }
</style>
