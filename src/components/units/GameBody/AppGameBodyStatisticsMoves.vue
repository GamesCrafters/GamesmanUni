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

        <button id="app-game-body-statistics-moves-swap"
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
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;

        > button {
            border-radius: 6px;
            border: 1px solid #e0ddd6;
            padding: 5px 12px;
            font-size: 13px;
            font-weight: 400;
            cursor: pointer;
            background: #ffffff;
            color: #555;
            white-space: nowrap;
            transition: border-color 0.15s, color 0.15s;

            &#app-game-body-statistics-moves-restart {
                background: #1b3a6b;
                color: #ffffff;
                border-color: #1b3a6b;
                font-weight: 500;

                &:not(:disabled):hover { opacity: 0.85; }
            }

            &:hover { transform: none; }

            &:not(:disabled):not(#app-game-body-statistics-moves-restart):hover {
                border-color: #1b3a6b;
                color: #1b3a6b;
            }

            &:disabled {
                opacity: 0.3;
                cursor: default;
            }
        }
    }
</style>
