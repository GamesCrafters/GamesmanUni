<template>
    <div id="app-game-body-statistics-data">
        <p id="roundId">Move #{{ roundId }}</p>
        <p id="turn">{{ currentPlayerName }}'s Turn</p>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../../scripts/plugins/store";

    const store = useStore();
    const roundId = computed(() => store.getters.currentRoundId);
    const currentPlayerName = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.name : ""));
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
