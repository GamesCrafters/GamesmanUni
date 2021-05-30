<template>
    <div id="app-game-body-board-fallback">
        <div id="position">
            <h3>Current Position</h3>
            <pre>{{ currentPosition }}</pre>
        </div>
        <div id="available-moves" v-if="showNextMoves">
            <h3 id="title">Available Move(s)</h3>
            <div id="moves">
                <template v-if="Object.keys(currentAvailableMoves).length">
                    <div class="move" v-for="availableMove in currentAvailableMoves" :key="availableMove.move" :class="[showNextMoveHints ? `uni-${availableMove.moveValue}` : '', !isComputerTurn ? 'moveIndicator' : '']" :style="{ opacity: showNextMoveDeltaRemotenesses ? availableMove.moveValueOpacity : 1 }" @click="!isComputerTurn && store.dispatch(actionTypes.runMove, { move: availableMove.move })">{{ availableMove.move }}</div>
                </template>
            </div>
        </div>
        <p id="no-more-move" v-else>No more available Move!</p>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { actionTypes, useStore } from "../../scripts/plugins/store";

    const store = useStore();
    const options = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.options : undefined));
    const showNextMoves = computed(() => (options.value ? options.value.showNextMoves : true));
    const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));
    const showNextMoveDeltaRemotenesses = computed(() => (options.value ? options.value.showNextMoveDeltaRemotenesses : true));
    const currentPosition = computed(() => store.getters.currentPosition.replace(/^;/, "").replace(/;$/, "").replace(/;/g, "\n").replace(/=/g, " = "));
    const currentAvailableMoves = computed(() => store.getters.currentAvailableMoves);
    const isComputerTurn = computed(() => store.getters.currentPlayer.id[0] === "c");
</script>

<style lang="scss" scoped>
    #app-game-body-board-fallback {
        > * {
            border: 0.1rem solid var(--neutralColor);
            border-radius: 1rem;
        }
        > #position {
            border: 0.1rem solid var(--neutralColor);
            border-radius: 1rem;
            > pre {
                display: inline-block;
                padding: 1rem;
            }
        }
        > #available-moves {
            padding: 1rem;
            > #title {
                margin: 1rem;
            }
            > #moves {
                align-content: center;
                align-items: center;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
                > .move {
                    border: 0.1rem solid var(--neutralColor);
                    border-radius: 1rem;
                    margin: 1rem;
                    padding: 1rem;
                    &.moveIndicator:hover {
                        cursor: pointer;
                    }
                }
            }
        }
        > #no-more-move {
            text-align: center;
        }
    }
</style>
