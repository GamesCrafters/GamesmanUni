<template>
    <component :is="getGameBoardComponent()" />
</template>

<script lang="ts" setup>
    import { useRoute } from "vue-router";
    import AppGameBoardDefault from "./AppGameBoardDefault.vue";
    import AppGameBoardTttRegular from "./AppGameBoardTttRegular.vue";

    const gameBoards: Record<string, any> = {
        "ttt-regular": AppGameBoardTttRegular,
    };
    const getGameBoardComponent = () => {
        const route = useRoute();
        const gameBoard = `${route.params.gameId}-${route.params.variantId}`;
        if (gameBoard in gameBoards) return gameBoards[gameBoard];
        return AppGameBoardDefault;
    };
</script>
