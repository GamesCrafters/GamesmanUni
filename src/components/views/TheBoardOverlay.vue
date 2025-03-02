<template>
    <component v-if="autoguiPosition === ''" :is="LoadingScreen"/>
    <component v-else-if="customGameBoardExists" :is="The404Page" />
    <ImageAutoGUI v-else :is-overlay="true"/>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import { useRoute } from "vue-router";
    import LoadingScreen from "../units/LoadingScreen.vue";
    import ImageAutoGUI from "../units/GameBody/ImageAutoGUI.vue";
    import The404Page from "./The404Page.vue";

    const store = useStore();
    const route = useRoute();

    const autoguiPosition = computed(() => store.getters.currentAutoguiPosition);
    const currentMatch = computed(() => (store.state.app.currentMatch ? store.state.app.currentMatch : undefined));
    const customGUIs: string[] = ["tictactoe","quarto","sim"];
    const customGameBoardExists = computed(() => gameId in customGUIs);

    const gameId = route.params.gameId as string;
    const variantId = route.params.variantId as string;
    const initialPosition = route.params.initialPosition as string;
    store.dispatch(actionTypes.initiateMatch, { gameId: gameId, variantId: variantId, startPosition: initialPosition });
</script>
