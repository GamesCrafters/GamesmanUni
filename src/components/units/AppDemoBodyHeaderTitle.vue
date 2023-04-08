<template>
    <div id="app-demo-body-header-title">
        <h2>{{ gameName }} ({{ variantDescription }})</h2>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../scripts/plugins/store";

    const store = useStore();
    const gameType = computed(() => store.getters.currentGameType);
    const gameId = computed(() => store.getters.currentGameId);
    const variantId = computed(() => store.getters.currentVariantId);
    const gameName = computed(() => {
        if (!store.getters.games(gameType.value)) return "";
        if (!store.getters.game(gameType.value, gameId.value)) return "";
        return store.getters.game(gameType.value, gameId.value).name;
    });
    const variantDescription = computed(() => {
        if (!store.getters.games(gameType.value)) return "";
        if (!store.getters.game(gameType.value, gameId.value)) return "";
        if (!store.getters.variant(gameType.value, gameId.value, variantId.value)) return "";
        return store.getters.variant(gameType.value, gameId.value, variantId.value).description;
    });
</script>

<style lang="scss" scoped>
    #app-demo-body-header-title {
        align-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
    }
</style>
