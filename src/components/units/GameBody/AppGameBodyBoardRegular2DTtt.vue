<template>
    <svg id="app-game-body-board-regular-2d-ttt" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <!-- Draw board -->
        <line x1="1" y1="22" x2="65" y2="22"/>
        <line x1="1" y1="44" x2="65" y2="44"/>
        <line x1="22" y1="1" x2="22" y2="65"/>
        <line x1="44" y1="1" x2="44" y2="65"/>

        <g v-for="cell in 9" :key="cell">

            <line :id="'xa' + cell" stroke="var(--turn1Color)" :x1="3 + xOffset(cell)" :y1="3 + yOffset(cell)" :x2="3 + xOffset(cell) + b16(board[cell].mark === 'x')" :y2="3 + yOffset(cell) + b16(board[cell].mark === 'x')"/>
            <line :id="'xb' + cell" stroke="var(--turn1Color)" :x1="19 + xOffset(cell)" :y1="3 + yOffset(cell)" :x2="19 + xOffset(cell) - b16(board[cell].mark === 'x')" :y2="3 + yOffset(cell) + b16(board[cell].mark === 'x')"/>
            <circle :id="'o' + cell" :transform="'rotate(-90 ' + (11 + xOffset(cell)) + ' ' + (11 + yOffset(cell)) + ')'" stroke="var(--turn2Color)" r="8" :cx="11 + xOffset(cell)" :cy="11 + yOffset(cell)" :stroke-dasharray="51" :stroke-dashoffset="board[cell].mark === 'o' ? 0 : 51"/>

            <g :class="isComputerTurn ? '' : 'button'" v-if="showMoveButtons && board[cell].mark === '-'">
                <circle v-if="showNextMoves && board[cell].hint"
                    r="3" :cx="11 + xOffset(cell)" :cy="11 + yOffset(cell)"
                    :class="getHintClass(board[cell].hint)"
                    :style="{ opacity: showNextMoveDeltaRemotenesses ? board[cell].hintOpacity : 1 }"
                />
                <rect v-if="currentRemoteness && !isComputerTurn"
                    cursor="pointer" fill="var(--backgroundColor)"
                    @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: board[cell].move })"
                    width="20" height="20" fill-opacity="0" stroke-opacity="0"
                    :x="1 + xOffset(cell)" :y="1 + yOffset(cell)"
                />
            </g>
        </g>
    </svg>
</template>

<script lang="ts" setup>
    import { computed, ref, watch } from "vue";
    import { actionTypes, useStore } from "../../../scripts/plugins/store";
    const sfx = import.meta.globEager("../../../models/images/svg/ttt/*");
    import gsap from "gsap";

    type CellData = { mark: string; move: string; hint: string; hintOpacity: number };
    type BoardData = Record<number, CellData>;
    const store = useStore();
    const options = computed(() => store.getters.options);
    const showNextMoves = computed(() => (options.value ? options.value.showNextMoves : true));
    const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));
    const showNextMoveDeltaRemotenesses = computed(() => (options.value ? options.value.showNextMoveDeltaRemotenesses : true));
    const currentPosition = computed(() => store.getters.currentPosition);
    const currentRemoteness = computed(() => store.getters.currentRemoteness);
    const isComputerTurn = computed(() => store.getters.currentPlayer.isComputer);
    const availableMoves = computed(() => store.getters.currentAvailableMoves);
    const turn = computed(() => currentPosition.value[2]);
    const board = computed(() => {
        showMoveButtons.value = true;
        let board: BoardData = {};
        for (let cell: number = 1; cell <= 9; cell++) board[cell] = { mark: currentPosition.value[7 + cell], move: "", hint: "", hintOpacity: 1 };
        for (let availableMove in availableMoves.value) Object.assign(board[+availableMoves.value[availableMove].move[4] + 1], { move: availableMoves.value[availableMove].move, hint: availableMoves.value[availableMove].moveValue, hintOpacity: availableMoves.value[availableMove].moveValueOpacity });
        return board;
    });
    const getHintClass = (hint: string): string => (showNextMoveHints.value ? "hint-" + hint : "hint-" + turn.value);
    const xOffset = (cell: number): number => ((cell - 1) % 3) * 22;
    const yOffset = (cell: number): number => Math.floor((cell - 1) / 3) * 22;
    const b16 = (cond: boolean): number => cond ? 16 : 0;

    const showMoveButtons = ref(true);
    const transitionTo = computed(() => store.getters.currentTransitionTo);

    watch(transitionTo, (newValue: any, oldValue: any) => {
        showMoveButtons.value = false;
        if (Boolean(newValue) == false || Boolean(oldValue) == false) return;
        const currBoard = oldValue.split("_")[4];
        const nextBoard = newValue.split("_")[4];
        var i, diffIdx = -1;
        var differenceExists = false;
        for (i = 0; i < 9; i++) {
            if (currBoard[i] != nextBoard[i]) {
                if (differenceExists) {
                    return;
                } else {
                    differenceExists = true;
                    diffIdx = i;
                }
            }
        }
        var audio;
        if (differenceExists) {
            if (currBoard[diffIdx] === '-') {
                if (nextBoard[diffIdx] === 'x') {
                    audio = new Audio(sfx['../../../models/images/svg/ttt/X.mp3'].default);
                    audio.play();
                    gsap.to("#xa" + (diffIdx + 1), {duration: 0.25, attr: {x2: "+=16", y2: "+=16"}});
                    gsap.to("#xb" + (diffIdx + 1), {delay: 0.25, duration: 0.25, attr: {x2: "-=16", y2: "+=16"}});
                } else if (nextBoard[diffIdx] === 'o') {
                    audio = new Audio(sfx['../../../models/images/svg/ttt/O.mp3'].default);
                    audio.play();
                    gsap.to("#o" + (diffIdx + 1), {duration: 0.5, attr: {"stroke-dashoffset": 0}})
                }
            }
        }
    });
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
        .hint- {
            &A {
                stroke: var(--turn1Color);
                fill: var(--turn1Color);
            }
            &B {
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
