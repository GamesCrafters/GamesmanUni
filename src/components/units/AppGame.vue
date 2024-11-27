<template>
    <div id="app-game">
        <AppGameBody />
        <AppGameMenu v-show="showMenu"/>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { onBeforeRouteLeave, useRoute } from "vue-router";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import AppGameBody from "./GameBody/AppGameBody.vue";
    import AppGameMenu from "./GameMenu/AppGameMenu.vue";

    const route = useRoute();
    const store = useStore();
    /* Change the following values to computed refs if game may change dynamically on this page. */
    const gameId = route.params.gameId as string;
    const variantId = route.params.variantId as string;
    const initialPosition = route.params.initialPosition as string;
    store.dispatch(actionTypes.initiateMatch, { gameId: gameId, variantId: variantId, startPosition: initialPosition });
    store.dispatch(actionTypes.addVVHInstructions);
    const options = computed(() => store.getters.options);
    const showMenu = computed(() => (options.value ? options.value.showMenu : true));
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
