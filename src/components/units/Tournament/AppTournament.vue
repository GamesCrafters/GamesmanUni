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
    import AppTournamentForm from "./AppTournamentForm.vue";
    import gsap from "gsap";

    const store = useStore();
    const games = [
        { gameType: "games", gameId: "ttt", variantId: "misere", userIsFirstPlayer: true },
        { gameType: "games", gameId: "snake", variantId: "regular", userIsFirstPlayer: true },
        { gameType: "games", gameId: "dragonsandswans", variantId: "3", userIsFirstPlayer: false, startPosition: "R_B_4_4_x--x-----o-----x_phase=1_numSwans=11"},
        { gameType: "games", gameId: "connect4c", variantId: "6x6", userIsFirstPlayer: false },
        { gameType: "games", gameId: "sim", variantId: "regular", userIsFirstPlayer: false}
    ];

    const currentGameIndex = ref(0);
    const initiateCurrentGame = () => {
        store.dispatch(actionTypes.initiateMatch, {
            gameType: games[currentGameIndex.value].gameType,
            gameId: games[currentGameIndex.value].gameId,
            variantId: games[currentGameIndex.value].variantId,
            startPosition: games[currentGameIndex.value].startPosition || undefined,
            firstPlayerIsComputer: !(games[currentGameIndex.value].userIsFirstPlayer),
            secondPlayerIsComputer: games[currentGameIndex.value].userIsFirstPlayer
        });
    }
    initiateCurrentGame();

    /* Game circulation */
    const isEndOfMatch = computed(() => store.getters.isEndOfMatch);

    const currentPositionValue = computed(() => store.getters.currentPositionValue);
    const currentPlayer = computed(() => store.getters.currentPlayer);
    const resultHalfRem = computed(() => {
        if (games[currentGameIndex.value].gameId === "connect4c" || games[currentGameIndex.value].gameId === "sim") {
            return Math.floor((store.getters.currentRoundId - 1) / 2);
        } else {
            return Math.floor(store.getters.currentRoundId / 2);
        }
    });
    const resultValue = computed(() => {
        if (currentPositionValue.value === 'win') {
            return (currentPlayer.value.isComputer) ? 2 : 1;
        } else if (currentPositionValue.value === 'tie') {
            return 0;
        } else if (currentPositionValue.value === 'lose') {
            return (!currentPlayer.value.isComputer) ? 2 : 1;
        } else {
            return 0;
        }
    });
    const currentTournamentStats = ref(0);
    watch(
        () => isEndOfMatch.value,
        async () => {
            if (isEndOfMatch.value) {
                await new Promise(r => setTimeout(r, 9000));
                gsap.to("#app-tournament", {duration: 0.5, autoAlpha: 0});
                /* Prevents restarting if already left the Demo page. */
                if (!store.getters.currentMatch.gameType) return;
                /* Prevents restarting when isEndOfMatch becomes false. */
                if (!isEndOfMatch.value) return;
                
                currentTournamentStats.value = currentTournamentStats.value * 1000 + resultValue.value * 100 + resultHalfRem.value;
                currentGameIndex.value += 1;
                await new Promise(r => setTimeout(r, 500));
                if (currentGameIndex.value >= games.length) {
                    const finalString = currentTournamentStats.value.toString(16); // "security"
                    const url = "https://rob8glap545.typeform.com/to/B6s3GNrL#osc=" + finalString;
                    window.location.href = url;
                } else {
                    initiateCurrentGame();
                    await new Promise(r => setTimeout(r, 3000));
                    gsap.to("#app-tournament", {duration: 0.5, autoAlpha: 1});
                }
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
