<template>
    <div id="app-game-body-board-fallback">
        <div id="position">
            <h3>Current Position</h3>
            <pre>{{ currentPosition }}</pre>
        </div>
        <div id="available-moves" v-if="showNextMoves">
            <h3>Available Move(s)</h3>
            <template v-if="Object.keys(currentAvailableMoves).length">
                <button v-for="availableMove in currentAvailableMoves" :key="availableMove.move" :class="showNextMoveHints ? `uni-${availableMove.moveValue}` : ''" :style="{ opacity: showNextMoveDeltaRemotenesses ? availableMove.moveValueOpacity : 1 }" @click="store.dispatch(actionTypes.runMove, { move: availableMove.move })">{{ availableMove.move }}</button>
            </template>
            <p v-else>No more available Move!</p>
        </div>
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
            > button {
                margin: 0.5rem;
                padding: 0 0.5rem;
            }
            > p {
                text-align: center;
            }
        }
    }
</style>
