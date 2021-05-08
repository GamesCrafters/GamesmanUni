<template>
    <component :is="getGameBoardComponent()" />
</template>

<script lang="ts" setup>
    import { useStore } from "../plugins/store";
    import AppGameBoardFallback from "./AppGameBoardFallback.vue";
    import AppGameBoardRegular2D from "./AppGameBoardRegular2D.vue";

    const gameBoards: Record<string, any> = {};
    const store = useStore();
    const getGameBoardComponent = () => {
        if (store.state.app.game.round.position.match(/^R_(A|B)_([0-9]+)_([0-9]+)_([a-zA-Z0-9-\*]+)(?:_(.*))?$/)) return AppGameBoardRegular2D;
        const gameBoard = `${store.state.app.game.id}-${store.state.app.game.variant.id}`;
        if (gameBoard in gameBoards) return gameBoards[gameBoard];
        return AppGameBoardFallback;
    };
</script>
