<template>
    <div id="app-game-body-board">
        <component :is="getGameBoardComponent" />
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../../scripts/plugins/store";
    import CharacterAutoGUI from "../GameBody/CharacterAutoGUI.vue";
    import AppGameBodyBoardRegular2D from "../GameBody/AppGameBodyBoardRegular2D.vue";

    const store = useStore();
    const gameId = computed(() => store.getters.currentGameId);
    const variantId = computed(() => store.getters.currentVariantId);
    const position = computed(() => store.getters.currentPosition);
    const gameBoards: Record<string, any> = {};
    const getGameBoardComponent = computed(() => {
        if (position.value.match(/^(1|2)_([a-zA-Z0-9-~]+)(?:_(.*))?$/)) return AppGameBodyBoardRegular2D;
        const gameBoard = `${gameId}-${variantId}`;
        if (gameBoard in gameBoards) return gameBoards[gameBoard];
        return CharacterAutoGUI;
    });
</script>
