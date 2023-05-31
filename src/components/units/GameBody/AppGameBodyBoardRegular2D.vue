<template>
    <component v-if="customGameBoardExists" :is="regular2DGameBoards[gameBoard]" />
    <component v-else-if="autoguiV2DataExists" :is="AppGameBodyBoardRegular2DImages" />
    <component v-else :is="AppGameBodyBoardFallback" />
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../../scripts/plugins/store";
    import AppGameBodyBoardFallback from "./AppGameBodyBoardFallback.vue"
    import AppGameBodyBoardRegular2DImages from "./AppGameBodyBoardRegular2DImages.vue";
    import AppGameBoardRegular2DTtt from "./AppGameBodyBoardRegular2DTtt.vue";
    import AppGameBoardRegular2DQuarto from "./AppGameBodyBoardRegular2DQuarto.vue";
    import AppGameBodyBoardSimRegular from "./AppGameBodyBoardSimRegular.vue";

    const store = useStore();
    const currentMatch = computed(() => (store.state.app.currentMatch ? store.state.app.currentMatch : undefined));
    const gameId = computed(() => (currentMatch.value ? currentMatch.value.gameId : ""));
    const variantId = computed(() => (currentMatch.value ? currentMatch.value.variantId : ""));
    const gameType = computed(() => (currentMatch.value ? currentMatch.value.gameType : ""));
    const autoguiV2Data = computed(() => store.getters.autoguiV2Data(gameType.value, gameId.value, variantId.value));
    const regular2DGameBoards: Record<string, any> = {
        "ttt-misere": AppGameBoardRegular2DTtt,
        "ttt-regular": AppGameBoardRegular2DTtt,
        "quarto-regular": AppGameBoardRegular2DQuarto,
        "sim-regular": AppGameBodyBoardSimRegular
    };
    const gameBoard = computed(() => `${gameId.value}-${variantId.value}`);
    const customGameBoardExists = computed(() => gameBoard.value in regular2DGameBoards);
    const autoguiV2DataExists = (autoguiV2Data.value != null);
</script>
