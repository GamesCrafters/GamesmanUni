<template>
    <div id="app-demo">
        <AppDemoBody />
        <AppGameVvh />
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref, watch } from "vue";
    import { onBeforeRouteLeave } from "vue-router";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import AppDemoBody from "./AppDemoBody.vue";
    import AppGameVvh from "./AppGameVvh.vue";

    const store = useStore();
    const games = [
        { gameType: "games", gameId: "1dchess", variantId: "regular" },
        { gameType: "games", gameId: "3spot", variantId: "regular" },
        { gameType: "games", gameId: "achi", variantId: "regular" },
        { gameType: "games", gameId: "chomp", variantId: "4x7" },
        { gameType: "games", gameId: "connect4c", variantId: "6x7" },
        { gameType: "games", gameId: "dodgem", variantId: "regular" },
        { gameType: "games", gameId: "gameofy", variantId: "dim5" },
        { gameType: "games", gameId: "haregame", variantId: "m-hounds-first" },
        { gameType: "games", gameId: "lite3", variantId: "three-in-a-row" },
        { gameType: "games", gameId: "notakto", variantId: "board3" },
        { gameType: "games", gameId: "othello", variantId: "regular" },
        { gameType: "games", gameId: "quarto", variantId: "regular" },
        { gameType: "games", gameId: "quickchess", variantId: "regular" },
        { gameType: "games", gameId: "stt", variantId: "default" },
        { gameType: "games", gameId: "snake", variantId: "regular" },
        { gameType: "games", gameId: "tactix", variantId: "regular" },
        { gameType: "games", gameId: "ttt", variantId: "regular" },
        { gameType: "games", gameId: "ttt", variantId: "misere" },
        { gameType: "games", gameId: "tttwo", variantId: "regular" },
        { gameType: "games", gameId: "topitop", variantId: "regular" },
    ];

    const currentGameIndex = ref(0);
    const initiateCurrentGame = () => {
        store.dispatch(actionTypes.initiateMatch, {
            gameType: games[currentGameIndex.value].gameType,
            gameId: games[currentGameIndex.value].gameId,
            variantId: games[currentGameIndex.value].variantId,
            firstPlayerIsComputer: true,
            secondPlayerIsComputer: true
        });
    }
    initiateCurrentGame();

    /* Game circulation */
    const repeat = 2;
    const currRep = ref(0);
    const gameOverTimeoutMilisec = 5000;
    const isEndOfMatch = computed(() => store.getters.isEndOfMatch);
    watch(
        () => isEndOfMatch.value,
        async () => {
            /* Prevents restarting if already left the Demo page. */
            if (!store.getters.currentMatch.gameType) return;
            /* Prevents restarting when isEndOfMatch becomes false. */
            if (!isEndOfMatch.value) return;
            await new Promise((resolve) => setTimeout(resolve, gameOverTimeoutMilisec));
            if (++currRep.value == repeat) {
                /* If reached max repeat times, load the next game in list. */
                currRep.value = 0;
                currentGameIndex.value = (currentGameIndex.value + 1) % games.length;
                initiateCurrentGame();
            } else {
                store.dispatch(actionTypes.restartMatch);
            }
        }
    );

    /* VVH autoscrolling */
    const vvh = ref<HTMLDivElement | null>(null);
    const currentRoundId = computed(() => store.getters.currentRoundId);
    // watch(
    //     () => currentRoundId.value,
    //     () => {
    //         if (vvh.value) vvh.value?.scrollIntoView();
    //     }
    // );

    onBeforeRouteLeave(async () => {
        store.dispatch(actionTypes.exitMatch)
    });
</script>

<style lang="scss" scoped>
    #app-demo {
        align-content: normal;
        // align-items: flex-end;
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
