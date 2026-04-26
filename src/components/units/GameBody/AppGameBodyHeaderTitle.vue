<template>
    <div id="app-game-body-header-title">
        <span class="title-name">{{ gameName }}</span>
        <span class="title-variant">({{ variantName }})</span>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../../scripts/plugins/store";

    const store = useStore();
    const gameId = computed(() => store.getters.currentGameId);
    const variantId = computed(() => store.getters.currentVariantId);
    const gameName = computed(() => (store.getters.game(gameId.value) ? store.getters.game(gameId.value).name : ""));
    const variantName = computed(() => (store.getters.game(gameId.value) && store.getters.variant(gameId.value, variantId.value) ? store.getters.variant(gameId.value, variantId.value).name : ""));
</script>

<style lang="scss" scoped>
    #app-game-body-header-title {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1px;
        flex: 1;
        min-width: 0;
    }

    .title-name {
        font-size: 18px;
        font-weight: 600;
        color: var(--gu-brand);
        white-space: nowrap;
    }

    .title-variant {
        font-size: 13px;
        font-weight: 400;
        color: var(--gu-text-muted);
        white-space: normal;
        overflow-wrap: break-word;
        word-break: break-word;
    }
</style>
