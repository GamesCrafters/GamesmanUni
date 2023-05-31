<template>
    <div id="app-game-body-board">
        <component :is="getGameBoardComponent()" />
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useRoute } from "vue-router";
    import { useStore } from "../../../scripts/plugins/store";
    import AppGameBodyBoardFallback from "./AppGameBodyBoardFallback.vue";
    import AppGameBodyBoardRegular2D from "./AppGameBodyBoardRegular2D.vue";

    const route = useRoute();
    const store = useStore();
    const gameId = route.params.gameId as string;
    const variantId = route.params.variantId as string;
    const position = computed(() => store.getters.currentPosition);
    const gameBoards: Record<string, any> = {};
    const getGameBoardComponent = () => {
        if (position.value.match(/^R_(A|B)_([0-9]+)_([0-9]+)_([a-zA-Z0-9-\*]+)(?:_(.*))?$/) || position.value[0] == 'C') return AppGameBodyBoardRegular2D;
        const gameBoard = `${gameId}-${variantId}`;
        if (gameBoard in gameBoards) return gameBoards[gameBoard];
        return AppGameBodyBoardFallback;
    };
</script>
