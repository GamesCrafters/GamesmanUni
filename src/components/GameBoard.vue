<template>
    <component :is="getGameBoardComponent()" />
</template>

<script lang="ts" setup>
    import { useRoute } from "vue-router";
    import GameBoardDefault from "./GameBoardDefault.vue";
    import GameBoardTttRegular from "./GameBoardTttRegular.vue";

    const gameBoards: Record<string, any> = {
        "ttt-regular": GameBoardTttRegular,
    };
    const getGameBoardComponent = () => {
        const route = useRoute();
        const gameBoard = `${route.params.gameId}-${route.params.variantId}`;
        if (gameBoard in gameBoards) return gameBoards[gameBoard];
        return GameBoardDefault;
    };
</script>
