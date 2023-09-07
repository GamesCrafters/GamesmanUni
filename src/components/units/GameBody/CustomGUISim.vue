<template>
    <svg id="custom-gui-sim" viewBox="-4.5 -4.5 9 9" xmlns="http://www.w3.org/2000/svg">
        
        <!-- Available move buttons (i.e., lines left to draw). -->
        <g v-if="!animationPlaying">
            <line v-for="(move, i) in richPositionData.moves" :key="'move' + i"
                :x1="vertices[move.from][0]" :y1="vertices[move.from][1]"
                :x2="vertices[move.to][0]" :y2="vertices[move.to][1]"
                :class="'app-sim-move ' + getBoardMoveElementHintClass(move)"
                :opacity="showNextMoveHints && showNextMoveDeltaRemotenesses ? move.hintOpacity : 1"
                @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: move.str })"/>
        </g>

        <!-- Already-drawn lines. -->
        <line v-for="(_, j) in 15" :key="'p' + j"
            :id="'simline' + moveNameList[j]"
            :x1="vertices[edges[j][0]][0]" :y1="vertices[edges[j][0]][1]"
            :x2="currentPosition[2 + j] === '-' ? vertices[edges[j][0]][0] : vertices[edges[j][1]][0]"
            :y2="currentPosition[2 + j] === '-' ? vertices[edges[j][0]][1] : vertices[edges[j][1]][1]"
            :style="'stroke:' + lineColor(currentPosition[2 + j]) + ';stroke-width:0.3;'"/>

        <!-- Six points. -->
        <circle v-for="(_, n) in 6" :key="'c' + n"
            :cx="vertices[n][0]" :cy="vertices[n][1]"
            r="0.3" fill="black"/>

    </svg>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { actionTypes, useStore } from "../../../scripts/plugins/store";

    interface GSimMove {
        str: string;
        hint: string;
        hintOpacity: number;
        from: number;
        to: number;
    }

    const store = useStore();
    const currentAvailableMoves = computed(() => store.getters.currentAvailableMoves);
    const options = computed(() => store.getters.options);
    const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));
    const showNextMoveDeltaRemotenesses = computed(() => options.value ? options.value.showNextMoveDeltaRemotenesses : true);
    const isComputerTurn = computed(() => store.getters.currentPlayer.isComputer);
    const currentPosition = computed(() => store.getters.currentPosition);
    const animationPlaying = computed(() => store.getters.animationPlaying);

    const isBlueTurn = computed(() => {
        var bluesturn = false;
        for (var i = 2; i < 17; i++) {
            if (currentPosition.value[i] === '-') {
                bluesturn = !bluesturn;
            }
        }
        return bluesturn;
    });

    const lineColor = ((character: string) : string => {
        return ((character === '-' && isBlueTurn.value) || character === 'x') ? 'blue' : 'red';
    });

    const vertices = [ [4, 0], [2, 3.4641], [-2, 3.4641], [-4, 0], [-2, -3.4641], [2, -3.4641] ];

    const edges = [
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], 
        [1, 2], [1, 3], [1, 4], [1, 5], [2, 3],
        [2, 4], [2, 5], [3, 4], [3, 5], [4, 5]
    ];

    const moveNameList = ['12', '13', '14', '15', '16', '23', '24', '25', '26', '34', '35', '36', '45', '46', '56']
    
    const richPositionData = computed(() => {
        const position: string = currentPosition.value;
        const matches = position.match(/^C_([a-zA-Z0-9-]+)*/)!;
        const validRichPosition = matches && matches.length >= 2;
        let moves: GSimMove[] = [];
        if (validRichPosition) {
            for (let nextMoveData of Object.values(currentAvailableMoves.value)) {
                moves.push({
                    str: nextMoveData.move,
                    hint: nextMoveData.moveValue,
                    hintOpacity: nextMoveData.moveValueOpacity,
                    from: Number(nextMoveData.moveName[0]) - 1,
                    to: Number(nextMoveData.moveName[1]) - 1
                });
            }
        }

        return { moves, validRichPosition };
    });

    const getBoardMoveElementHintClass = 
    (move?: GSimMove): string => 
      (move && options.value.showNextMoveHints ? "hint-" + move.hint : "");

</script>

<style lang="scss" scoped>
    @keyframes pulsing-line {
        0% { stroke-width: 0.2; }
        100% { stroke-width: 0.3; }
    }

    .app-sim-move {
        stroke: gray;
        stroke-width: 0.2;

        &.hint- {
            &win { stroke: var(--winColor); }
            &tie { stroke: var(--tieColor); }
            &lose { stroke: var(--loseColor); }
        }

        &:hover {
            animation-name: pulsing-line;
            animation-duration: 0.3s;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            animation-direction: alternate;
        }
    }
</style>
