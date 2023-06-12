<template>
    <component v-if="customGameBoardExists" :is="regular2DGameBoards[gameBoard]" />
    <component v-else-if="autoguiV2DataExists" :is="ImageAutoGUI" />
    <component v-else :is="CharacterAutoGUI" />
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../../scripts/plugins/store";
    import CharacterAutoGUI from "./CharacterAutoGUI.vue"
    import ImageAutoGUI from "./ImageAutoGUI.vue";
    import CustomGUITicTacToe from "./CustomGUITicTacToe.vue";
    import CustomGUIQuarto from "./CustomGUIQuarto.vue";
    import CustomGUISim from "./CustomGUISim.vue";

    const store = useStore();
    const currentMatch = computed(() => (store.state.app.currentMatch ? store.state.app.currentMatch : undefined));
    const gameId = computed(() => (currentMatch.value ? currentMatch.value.gameId : ""));
    const variantId = computed(() => (currentMatch.value ? currentMatch.value.variantId : ""));
    const gameType = computed(() => (currentMatch.value ? currentMatch.value.gameType : ""));
    const autoguiV2Data = computed(() => store.getters.autoguiV2Data(gameType.value, gameId.value, variantId.value));
    const regular2DGameBoards: Record<string, any> = {
        "ttt-misere": CustomGUITicTacToe,
        "ttt-regular": CustomGUITicTacToe,
        "quarto-regular": CustomGUIQuarto,
        "sim-regular": CustomGUISim
    };
    const gameBoard = computed(() => `${gameId.value}-${variantId.value}`);
    const customGameBoardExists = computed(() => gameBoard.value in regular2DGameBoards);
    const autoguiV2DataExists = (autoguiV2Data.value != null);
</script>
