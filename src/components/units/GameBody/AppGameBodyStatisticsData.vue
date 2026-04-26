<template>
    <div id="app-game-body-statistics-data">
        <p id="roundId">Move {{ roundId }}</p>
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
        display: flex;
        align-items: center;
        gap: 6px;
        flex: 0 0 auto;

        > * {
            border-radius: 6px;
            border: 1px solid var(--gu-border);
            padding: 5px 12px;
            font-size: 13px;
            font-weight: 500;
            color: var(--gu-brand);
            background: var(--gu-surface);
            white-space: nowrap;
        }
    }
</style>
