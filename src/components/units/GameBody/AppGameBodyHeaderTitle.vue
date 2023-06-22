<template>
    <div id="app-game-body-header-title">
        <h2>{{ gameName }} ({{ variantDescription }})</h2>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useRoute } from "vue-router";
    import { useStore } from "../../../scripts/plugins/store";

    const route = useRoute();
    const store = useStore();
    const gameType = route.params.type as string;
    const gameId = route.params.gameId as string;
    const variantId = route.params.variantId as string;
    const gameName = computed(() => (store.getters.game(gameType, gameId) ? store.getters.game(gameType, gameId).name : ""));
    const variantDescription = computed(() => (store.getters.game(gameType, gameId) && store.getters.variant(gameType, gameId, variantId) ? store.getters.variant(gameType, gameId, variantId).description : ""));
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
