<template>
    <div id="app-game-body-statistics-data">
        <p>Move #{{ roundId }}</p>
        <p>Remoteness {{ roundRemoteness }}</p>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../scripts/plugins/store";

    const store = useStore();
    const roundId = computed(() => store.getters.currentRoundId);
    const roundRemoteness = computed(() => store.getters.currentRemoteness);
</script>

<style lang="scss" scoped>
    #app-game-body-statistics-data {
        align-content: center;
        align-items: stretch;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: stretch;
        > p {
            border-radius: 1rem;
            border: 0.1rem solid var(--neutralColor);
            flex: 1 1 auto;
            padding: 1rem;
            text-align: center;
        }
    }
</style>
