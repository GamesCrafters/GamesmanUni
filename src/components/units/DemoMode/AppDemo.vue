<template>
    <div id="app-demo">
        <AppDemoBody />
        <AppGameVvh />
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref, watch } from "vue";
    import { onBeforeRouteLeave } from "vue-router";
    import { actionTypes, mutationTypes, useStore } from "../../../scripts/plugins/store";
    import AppDemoBody from "./AppDemoBody.vue";
    import AppGameVvh from "../VVH/AppGameVvh.vue";

    const store = useStore();
    const games = [
        { gameId: "1dchess", variantId: "regular", isDrawGame: false },
        { gameId: "fivefieldkono", variantId: "delta", isDrawGame: true },
        { gameId: "chinesechess", variantId: "regular", isDrawGame: false, startPosition: "R_A_10_9_---k---------------------P---------------------------R-------------n------------------K---" },
        { gameId: "3spot", variantId: "regular", isDrawGame: false },
        { gameId: "achi", variantId: "regular", isDrawGame: false },
        { gameId: "beeline", variantId: "regular", isDrawGame: true },
        { gameId: "chomp", variantId: "4x7", isDrawGame: false },
        { gameId: "369mm", variantId: "regular", isDrawGame: true },
        { gameId: "connect4c", variantId: "6x7", isDrawGame: false },
        { gameId: "dinododgem", variantId: "regular", isDrawGame: true },
        { gameId: "dodgem", variantId: "regular", isDrawGame: false },
        { gameId: "gameofy", variantId: "dim5", isDrawGame: false },
        { gameId: "haregame", variantId: "m-hounds-first", isDrawGame: false },
        { gameId: "baghchal", variantId: "regular", isDrawGame: true },
        { gameId: "lite3", variantId: "three-in-a-row", isDrawGame: false },
        { gameId: "Lgame", variantId: "regular", isDrawGame: true },
        { gameId: "notakto", variantId: "board3", isDrawGame: false },
        { gameId: "othello", variantId: "regular", isDrawGame: false },
        { gameId: "quarto", variantId: "regular", isDrawGame: false },
        { gameId: "quickcross", variantId: "regular", isDrawGame: true },
        { gameId: "quickchess", variantId: "regular", isDrawGame: false },
        { gameId: "stt", variantId: "default", isDrawGame: false },
        { gameId: "dao", variantId: "regular", isDrawGame: true },
        { gameId: "tactix", variantId: "regular", isDrawGame: false },
        { gameId: "ttt", variantId: "regular", isDrawGame: false },
        { gameId: "mutorere", variantId: "regular", isDrawGame: true },
        { gameId: "tttwo", variantId: "regular", isDrawGame: false },
        { gameId: "topitop", variantId: "regular", isDrawGame: false },
    ];

    const currentGameIndex = ref(0);
    const initiateCurrentGame = async () => {
        await store.dispatch(actionTypes.initiateMatch, {
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
    const repeat = 1;
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
        align-items: flex-start;
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
