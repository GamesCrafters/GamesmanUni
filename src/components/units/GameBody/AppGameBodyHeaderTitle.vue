<template>
    <div id="app-game-body-header-title">
        <h2>{{ gameName }} ({{ variantName }})</h2>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useRoute } from "vue-router";
    import { useStore } from "../../../scripts/plugins/store";

    const route = useRoute();
    const store = useStore();
    const gameId = route.params.gameId as string;
    const variantId = route.params.variantId as string;
    const gameName = computed(() => (store.getters.game(gameId) ? store.getters.game(gameId).name : ""));
    const variantName = computed(() => (store.getters.game(gameId) && store.getters.variant(gameId, variantId) ? store.getters.variant(gameId, variantId).name : ""));
</script>

<style lang="scss" scoped>
    #app-game-body-header-title {
        align-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
    }
</style>
