<template>
    <div id="app-game">
        <AppGameBody />
        <AppGameVvh />
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useRoute } from "vue-router";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import AppGameBody from "./AppGameBody.vue";
    import AppGameVvh from "./AppGameVvh.vue";

    const route = useRoute();
    const store = useStore();
    const gameType = computed(() => route.params.type as string);
    const gameId = computed(() => route.params.gameId as string);
    const variantId = computed(() => route.params.variantId as string);
    const matchType = "pvp";
    const startingPlayerId = "p1";
    store.dispatch(actionTypes.initiateMatch, { gameType: gameType.value, gameId: gameId.value, variantId: variantId.value, matchType, startingPlayerId });
</script>

<style lang="scss" scoped>
    #app-game {
        align-content: normal;
        align-items: flex-end;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        padding: 1rem;
        > * {
            flex: 1 1 auto;
            margin: 1rem;
        }
        &:first-child {
            flex: 1 1 auto;
        }
        &:nth-child(2) {
            flex: 2 1 auto;
        }
    }
</style>
