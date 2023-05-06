<template>
    <svg id="app-game-body-board-sim-regular" viewBox="-4.5 -4.5 9 9" xmlns="http://www.w3.org/2000/svg">

        <!-- Background. -->
        <template v-for="j in 15"
            :key="j">
            <line v-if="isEndOfMatch && (currentPosition[1 + j] === '-')"
                :x1="vertices[edges[j - 1][0]][0]"
                :y1="vertices[edges[j - 1][0]][1]"
                :x2="vertices[edges[j - 1][1]][0]"
                :y2="vertices[edges[j - 1][1]][1]"
                :style="'stroke:gray;stroke-width:0.2;'"
                :opacity="0.2"
            />
        </template>

        <!-- Lines to place. -->
        <g v-for="(move, i) in richPositionData.moves" :key="'move' + i">
            <line 
                :x1="vertices[move.from][0]"
                :y1="vertices[move.from][1]"
                :x2="vertices[move.to][0]"
                :y2="vertices[move.to][1]"
                :class="'app-sim-move ' + getBoardMoveElementHintClass(move)"
                :style="{
                    opacity: showNextMoveHints && showNextMoveDeltaRemotenesses ? move.hintOpacity : 1,
                }"
                @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: move.str })"/>
        </g>

        <!-- Lines placed. -->
        <template v-for="j in 15"
            :key="j">
            <line v-if="!(currentPosition[1 + j] === '-')"
                :x1="vertices[edges[j - 1][0]][0]"
                :y1="vertices[edges[j - 1][0]][1]"
                :x2="vertices[edges[j - 1][1]][0]"
                :y2="vertices[edges[j - 1][1]][1]"
                :style="'stroke:' + ((currentPosition[1 + j] == 'x') ? 'blue' : 'red') + ';stroke-width:0.3;'"
            />
        </template>

        <circle v-for="n in 6"
            :key="n"
            :cx="vertices[n - 1][0]"
            :cy="vertices[n - 1][1]"
            :r="0.3"
            :style="'fill:black;'"
            />
    </svg>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { actionTypes, useStore } from "../../scripts/plugins/store";

    interface GSimMove {
        str: string; // UWAPI move string
        hint: string;
        hintOpacity: number;
        from: number;
        to: number;
    }

    const store = useStore();
    const isEndOfMatch = computed(() => store.getters.isEndOfMatch);
    const currentPosition = computed(() => store.getters.currentPosition);
    const currentAvailableMoves = computed(() => store.getters.currentAvailableMoves);
    const options = computed(() => store.getters.options);
    const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));
    const showNextMoveDeltaRemotenesses = computed(() => options.value ? options.value.showNextMoveDeltaRemotenesses : true);
    const isComputerTurn = computed(() => store.getters.currentPlayer.isComputer);

    const vertices = computed(() => [
        [-4, 0], [2, 3.4641], [-2, 3.4641], [4, 0], [-2, -3.4641], [2, -3.4641]
    ]);

    const edges = computed(() => [
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], 
        [1, 2], [1, 3], [1, 4], [1, 5], [2, 3],
        [2, 4], [2, 5], [3, 4], [3, 5], [4, 5]
    ]);
    
    const richPositionData = computed(() => {
        const position: string = currentPosition.value;
        const matches = position.match(/^C_([a-zA-Z0-9-\*]+)*/)!;
        const validRichPosition = matches && matches.length >= 2;
        let moves: GSimMove[] = [];
        if (validRichPosition) {
            for (let nextMoveData of Object.values(currentAvailableMoves.value)) {        
                const move = {
                    str: nextMoveData.move,
                    hint: nextMoveData.moveValue,
                    hintOpacity: nextMoveData.moveValueOpacity,
                    from: Number(nextMoveData.moveName[0]) - 1,
                    to: Number(nextMoveData.moveName[1]) - 1
                };

                console.log(Number(nextMoveData.moveName[0]) - 1, Number(nextMoveData.moveName[1]) - 1);

                moves.push(move);
            }
        }

        return {
            moves,
            validRichPosition,
        };
    });

    const getBoardMoveElementHintClass = 
    (move?: GSimMove): string => 
      (move && options.value.showNextMoveHints ? "hint-" + move.hint : "");

</script>

<style lang="scss" scoped>
    @keyframes pulsing-arrow {
        0% {
            stroke-width: 0.2;
        }
        100% {
            stroke-width: 0.3;
        }
    }

    .app-sim-move {
        stroke: gray;
        stroke-width: 0.2;

        &.hint- {
            &win {
                stroke: var(--winColor);
            }
            &tie {
                stroke: var(--tieColor);
            }
            &lose {
                stroke: var(--loseColor);
            }
        }

        &:hover {
            animation-name: pulsing-arrow;
            animation-duration: 0.3s;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            animation-direction: alternate;
        }
    }
</style>
