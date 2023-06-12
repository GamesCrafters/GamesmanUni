<template>
    <div id="app-game-body-statistics-moves">
        <button id="app-game-body-statistics-moves-undo"
            @click="store.dispatch(actionTypes.undoMove)"
            :disabled="disabledUndo">
                Undo
        </button>

        <button id="app-game-body-statistics-moves-restart"
            @click="store.dispatch(actionTypes.restartMatch)"
            :disabled="disabledRestart">
                Restart
        </button>

        <button id="app-game-body-statistics-moves-redo"
            @click="store.dispatch(actionTypes.redoMove)"
            :disabled="disabledRedo">
                Redo
        </button>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { actionTypes, useStore } from "../../../scripts/plugins/store";

    const store = useStore();
    const computerMoving = computed(() => store.getters.computerMoving);
    const disabledUndo = computed(() => !store.getters.undoMoveAvailable || computerMoving.value);
    const disabledRestart = computed(() => computerMoving.value);
    const disabledRedo = computed(() => !store.getters.redoMoveAvailable || computerMoving.value);
</script>

<style lang="scss" scoped>
    #app-game-body-statistics-moves {
        align-content: stretch;
        align-items: center;
        border-radius: 1rem;
        border: 0.1rem solid var(--neutralColor);
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-around;
        padding: 1rem;
        > button {
            margin: 0.5rem;
            padding: 0 0.5rem;
        }
    }
</style>
