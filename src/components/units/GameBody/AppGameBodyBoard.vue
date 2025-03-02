<template>
    <component v-if="autoguiPosition === ''" :is="LoadingScreen"/>
    <component v-else-if="customGameBoardExists" :is="customGUIs[gameId]" />
    <ImageAutoGUI v-else :is-overlay="false" />
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../../scripts/plugins/store";
    import LoadingScreen from "../LoadingScreen.vue"
    import ImageAutoGUI from "./ImageAutoGUI.vue";
    import CustomGUITicTacToe from "./CustomGUITicTacToe.vue";
    import CustomGUIQuarto from "./CustomGUIQuarto.vue";
    import CustomGUISim from "./CustomGUISim.vue";

    const store = useStore();
    const autoguiPosition = computed(() => store.getters.currentAutoguiPosition);
    const currentMatch = computed(() => (store.state.app.currentMatch ? store.state.app.currentMatch : undefined));
    const gameId = computed(() => (currentMatch.value ? currentMatch.value.gameId : ""));
    const customGUIs: Record<string, any> = {
        "tictactoe": CustomGUITicTacToe,
        "quarto": CustomGUIQuarto,
        "sim": CustomGUISim
    };
    const customGameBoardExists = computed(() => gameId.value in customGUIs);
</script>
