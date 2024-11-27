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

        <button id="app-game-body-statistics-moves-restart"
            @click="swapPlayers()"
            :disabled="currentRoundId != 1 || currentGameType === 'puzzles'">
                Swap
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
    import { mutationTypes, actionTypes, useStore } from "../../../scripts/plugins/store";

    const store = useStore();
    const computerMoving = computed(() => store.getters.computerMoving);
    const disabledUndo = computed(() => !store.getters.undoMoveAvailable || computerMoving.value);
    const disabledRestart = computed(() => computerMoving.value);
    const disabledRedo = computed(() => !store.getters.redoMoveAvailable || computerMoving.value);

    const currentGameType = computed(() => store.getters.currentGameType);
    const currentRoundId = computed(() => store.getters.currentRoundId);

    const swapPlayers = () => {
        const tempPlayer = store.getters.currentLeftPlayer.name;
        const leftPlayerIsComputer = store.getters.currentLeftPlayer.isComputer;
        const rightPlayerIsComputer = store.getters.currentRightPlayer.isComputer;
        const tempCPUsStrategies = [store.getters.currentCPUStrategy(1), store.getters.currentCPUStrategy(0)]
        const tempCPUsRatings = [store.getters.currentCPURating(1),store.getters.currentCPURating(0)];
        store.commit(mutationTypes.setCPUsRatings, tempCPUsRatings);
        store.commit(mutationTypes.setCPUsStrategies, tempCPUsStrategies);
        store.commit(mutationTypes.setCurrentLeftPlayerName, store.getters.currentRightPlayer.name);
        store.commit(mutationTypes.setCurrentRightPlayerName, tempPlayer);
        store.commit(mutationTypes.setLeftPlayerIsComputer, rightPlayerIsComputer);
        store.commit(mutationTypes.setRightPlayerIsComputer, leftPlayerIsComputer);
    }
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
