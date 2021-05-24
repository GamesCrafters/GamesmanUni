<template>
    <p id="app-game-body-statistics-data">Move #{{ roundId }}</p>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../scripts/plugins/store";

    const store = useStore();
    const roundId = computed(() => store.getters.currentRoundId);
</script>

<style lang="scss" scoped>
    #app-game-body-statistics-data {
        border-radius: 1rem;
        border: 0.1rem solid var(--neutralColor);
        padding: 2rem;
        text-align: center;
    }
</style>
