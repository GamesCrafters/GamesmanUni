<template>
    <div id="app-game">
        <AppGameBody />
        <AppGameVvh />
        <textarea 
            type="text"
            v-model="moveHistoryText"
            style="height: 100px; width: 300px;"
            readonly
        ></textarea>
        <AppGameMenu v-show="showVvh"/>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref } from "vue";
    import { onBeforeRouteLeave, useRoute } from "vue-router";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import AppGameBody from "./AppGameBody.vue";
    import AppGameMenu from "./AppGameMenu.vue";

    const route = useRoute();
    const store = useStore();
    const gameType = computed(() => route.params.type as string);
    const gameId = computed(() => route.params.gameId as string);
    const variantId = computed(() => route.params.variantId as string);
    store.dispatch(actionTypes.initiateMatch, { gameType: gameType.value, gameId: gameId.value, variantId: variantId.value });
    const moveHistoryText = computed(() => store.getters.moveHistory)
    const options = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.options : undefined));
    const showVvh = computed(() => (options.value ? options.value.showVvh : true));
    onBeforeRouteLeave(() => store.dispatch(actionTypes.exitMatch));
</script>

<style lang="scss" scoped>
    #app-game {
        align-content: normal;
        align-items: flex-start;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        padding: 1rem;
        > * {
            margin: 1rem;
        }
    }
</style>
