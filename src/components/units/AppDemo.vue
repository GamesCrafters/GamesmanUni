<template>
    <div id="app-demo">
        <AppDemoBody />
        <AppGameVvh />
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref, watch } from "vue";
    import { onBeforeRouteLeave } from "vue-router";
    import { actionTypes, mutationTypes, useStore } from "../../scripts/plugins/store";
    import AppDemoBody from "./AppDemoBody.vue";
    import AppGameVvh from "./AppGameVvh.vue";

    const store = useStore();
    const games = [
        { gameType: "games", gameId: "1dchess", variantId: "regular", isDrawGame: false },
        { gameType: "games", gameId: "fivefieldkono", variantId: "delta", isDrawGame: true },
        { gameType: "games", gameId: "chinesechess", variantId: "regular", isDrawGame: false, startPosition: "R_A_10_9_---k---------------------P---------------------------R-------------n------------------K---" },
        { gameType: "games", gameId: "3spot", variantId: "regular", isDrawGame: false },
        { gameType: "games", gameId: "achi", variantId: "regular", isDrawGame: false },
        { gameType: "games", gameId: "beeline", variantId: "regular", isDrawGame: true },
        { gameType: "games", gameId: "chomp", variantId: "4x7", isDrawGame: false },
        { gameType: "games", gameId: "369mm", variantId: "regular", isDrawGame: true },
        { gameType: "games", gameId: "connect4c", variantId: "6x7", isDrawGame: false },
        { gameType: "games", gameId: "dinododgem", variantId: "regular", isDrawGame: true },
        { gameType: "games", gameId: "dodgem", variantId: "regular", isDrawGame: false },
        { gameType: "games", gameId: "gameofy", variantId: "dim5", isDrawGame: false },
        { gameType: "games", gameId: "haregame", variantId: "m-hounds-first", isDrawGame: false },
        { gameType: "games", gameId: "baghchal", variantId: "regular", isDrawGame: true },
        { gameType: "games", gameId: "lite3", variantId: "three-in-a-row", isDrawGame: false },
        { gameType: "games", gameId: "Lgame", variantId: "regular", isDrawGame: true },
        { gameType: "games", gameId: "notakto", variantId: "board3", isDrawGame: false },
        { gameType: "games", gameId: "othello", variantId: "regular", isDrawGame: false },
        { gameType: "games", gameId: "quarto", variantId: "regular", isDrawGame: false },
        { gameType: "games", gameId: "quickcross", variantId: "regular", isDrawGame: true },
        { gameType: "games", gameId: "quickchess", variantId: "regular", isDrawGame: false },
        { gameType: "games", gameId: "stt", variantId: "default", isDrawGame: false },
        { gameType: "games", gameId: "dao", variantId: "regular", isDrawGame: true },
        { gameType: "games", gameId: "tactix", variantId: "regular", isDrawGame: false },
        { gameType: "games", gameId: "ttt", variantId: "regular", isDrawGame: false },
        { gameType: "games", gameId: "mutorere", variantId: "regular", isDrawGame: true },
        { gameType: "games", gameId: "tttwo", variantId: "regular", isDrawGame: false },
        { gameType: "games", gameId: "topitop", variantId: "regular", isDrawGame: false },
    ];

    const currentGameIndex = ref(0);
    const initiateCurrentGame = async () => {
        await store.dispatch(actionTypes.initiateMatch, {
            gameType: games[currentGameIndex.value].gameType,
            gameId: games[currentGameIndex.value].gameId,
            variantId: games[currentGameIndex.value].variantId,
            startPosition: games[currentGameIndex.value].startPosition || undefined,
            firstPlayerIsComputer: true,
            secondPlayerIsComputer: true
        });
        store.commit(mutationTypes.setLeftPlayerIsComputer, true);
        store.commit(mutationTypes.setRightPlayerIsComputer, true);
    }
    initiateCurrentGame();

    /* Game circulation */
    const repeat = 2;
    const currRep = ref(0);
    const gameOverTimeoutMilisec = 5000;
    const isEndOfDrawMatch = computed(() => games[currentGameIndex.value].isDrawGame && store.getters.currentRoundId > 21);
    const isEndOfMatch = computed(() => store.getters.isEndOfMatch || isEndOfDrawMatch.value);
    watch(
        () => isEndOfMatch.value,
        async () => {
            /* Prevents restarting if already left the Demo page. */
            if (!store.getters.currentMatch.gameType) return;
            /* Prevents restarting when isEndOfMatch becomes false. */
            if (!isEndOfMatch.value) return;
            store.commit(mutationTypes.setLeftPlayerIsComputer, false);
            store.commit(mutationTypes.setRightPlayerIsComputer, false);
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
