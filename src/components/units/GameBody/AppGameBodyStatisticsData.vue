<template>
    <div id="app-game-body-statistics-data">
        <p id="roundId">Move #{{ roundId }}</p>
        <p id="turn">
            <span :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</span>'s Turn
            <span v-if="automovingSingleMove" style="font-weight:800;"> [Autoselecting Only Move]</span>
        </p>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../../scripts/plugins/store";

    const store = useStore();
    const roundId = computed(() => store.getters.currentRoundId);
    const currentPlayerName = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.name : ""));
    const currentTurn = computed(() => (store.getters.currentMatch.round.firstPlayerTurn ? 1 : 2));
    const currentPlayerIsComputer = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.isComputer : false));
    const automovingSingleMove = computed(() => (
        !currentPlayerIsComputer.value && store.getters.options.automoveIfSingleMove && 
        Object.keys(store.getters.currentAvailableMoves).length == 1));
</script>

<style lang="scss" scoped>
    #app-game-body-statistics-data {
        > * {
            border-radius: 1rem;
            border: 0.1rem solid var(--neutralColor);
            padding: 0.5rem;
            text-align: center;
        }
    }
</style>
