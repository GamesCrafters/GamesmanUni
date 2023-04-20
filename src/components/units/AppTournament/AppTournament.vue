<template>
    <div id="app-tournament"> 
        <AppTournamentHeader />
        <AppTournamentBody />
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref, watch } from "vue";
    import { onBeforeRouteLeave } from "vue-router";
    import { actionTypes, useStore } from "../../../scripts/plugins/store";
    import AppTournamentBody from "./AppTournamentBody.vue"
    import AppTournamentHeader from "./AppTournamentHeader.vue";

    const store = useStore();
    const games = [
        { gameType: "games", gameId: "ttt", variantId: "misere", userIsFirstPlayer: true },
        { gameType: "games", gameId: "snake", variantId: "regular", userIsFirstPlayer: true },
        { gameType: "games", gameId: "connect4c", variantId: "6x6", userIsFirstPlayer: false }
    ];

    const currentGameIndex = ref(0);
    const initiateCurrentGame = () => {
        store.dispatch(actionTypes.initiateMatch, {
            gameType: games[currentGameIndex.value].gameType,
            gameId: games[currentGameIndex.value].gameId,
            variantId: games[currentGameIndex.value].variantId,
            firstPlayerIsComputer: !(games[currentGameIndex.value].userIsFirstPlayer),
            secondPlayerIsComputer: games[currentGameIndex.value].userIsFirstPlayer
        });
    }
    initiateCurrentGame();

    /* Game circulation */
    const repeat = 1;
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

    onBeforeRouteLeave(async () => {
        store.dispatch(actionTypes.exitMatch)
    });

</script>

<style lang="scss" scoped>
    #app-tournament {
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
