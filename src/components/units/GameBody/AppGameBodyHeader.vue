<template>
    <div id="app-game-body-header">
        <AppGameBodyHeaderInstructions />
        <button @click="swapPlayers()" :disabled="!isEndOfMatch || currentGameType === 'puzzles'" title="Swap Players">⇆</button>
        <AppGameBodyHeaderTitle />
        <AppGameBodyHeaderScorecard />
        <AppGameBodyHeaderOptions />
    </div>
</template>

<script lang="ts" setup>
    import AppGameBodyHeaderTitle from "./AppGameBodyHeaderTitle.vue";
    import AppGameBodyHeaderInstructions from "./AppGameBodyHeaderInstructions.vue";
    import AppGameBodyHeaderOptions from "./AppGameBodyHeaderOptions.vue";
    import AppGameBodyHeaderScorecard from "./AppGameBodyHeaderScorecard.vue";

    import { mutationTypes, actionTypes, useStore } from "../../../scripts/plugins/store";
    import { computed } from "vue";

    const store = useStore();

    const isEndOfMatch = computed(() => store.getters.isEndOfMatch);
    const currentGameType = computed(() => store.getters.currentGameType);

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
        store.commit(mutationTypes.setLeftPlayerIsComputer, rightPlayerIsComputer)
        store.commit(mutationTypes.setRightPlayerIsComputer, leftPlayerIsComputer);
        store.dispatch(actionTypes.restartMatch);
    }
</script>

<style lang="scss" scoped>
    #app-game-body-header {
        align-content: center;
        align-items: center;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        > * {
            margin: 1rem;
        }

        button {
            border-radius: 100%;
            font-size: 2rem;
            height: max(2.5rem, min(5vh, 5vw));
            width: max(2.5rem, min(5vh, 5vw));
        }

        button:disabled {
            cursor: auto;
            opacity: 0.5;
        }
    }
</style>
