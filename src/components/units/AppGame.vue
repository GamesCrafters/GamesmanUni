<template>
    <div id="app-game">
        <AppGameBody id="body" />
        <AppGameVisualValueHistory id="vvh" />
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { onBeforeRouteLeave, useRoute } from "vue-router";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import AppGameBody from "./AppGameBody.vue";
    import AppGameVisualValueHistory from "./AppGameVisualValueHistory.vue";

    const route = useRoute();
    const store = useStore();
    const gameType = computed(() => route.params.type as string);
    const gameId = computed(() => route.params.gameId as string);
    const variantId = computed(() => route.params.variantId as string);
    const matchType = "pvp";
    const startingPlayerId = "p1";
    store.dispatch(actionTypes.initiateMatch, { gameType: gameType.value, gameId: gameId.value, variantId: variantId.value, matchType, startingPlayerId });
    onBeforeRouteLeave(() => {
        store.dispatch(actionTypes.exitMatch);
    });
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
        > #body {
            flex: 1 1 auto;
            margin: 1rem;
        }
        > #vvh {
            flex: 2 1 auto;
            margin: 1rem;
        }
    }
</style>
