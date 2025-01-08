<template>
    <div id="app-demo">
        <div class="dbody">
            <AppDemoBody />
        </div>
        <div class="dvvh">
            <AppGameVvh />
        </div>
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
        { gameId: "tictactoe", variantId: "regular", isDrawGame: false },
        { gameId: "abrobad", variantId: "standard", isDrawGame: false },
        { gameId: "chinesechess", variantId: "regular", isDrawGame: false, startPosition: "1_---k---------------------P---------------------------R-------------n------------------K---" },
        { gameId: "topitop", variantId: "regular", isDrawGame: false },
        { gameId: "quarto", variantId: "regular", isDrawGame: false },
        { gameId: "kayles", variantId: "12", isDrawGame: false },
        { gameId: "lewthwaitesgame", variantId: "standard", isDrawGame: false },
        { gameId: "nim", variantId: "7_8_11_13_15", isDrawGame: false },
        { gameId: "rubiksmagic", variantId: "regular", isDrawGame: false },
        { gameId: "joust", variantId: "5x4", isDrawGame: false },
        { gameId: "domineering", variantId: "6", isDrawGame: false },
        { gameId: "chopsticks", variantId: "0", isDrawGame: true },
        { gameId: "change", variantId: "regular", isDrawGame: false },
        { gameId: "nutictactoe", variantId: "regular", isDrawGame: true },
        { gameId: "oddoreven", variantId: "regular", isDrawGame: false },
        { gameId: "ponghauki", variantId: "regular", isDrawGame: true },
        { gameId: "squaredance", variantId: "regular", isDrawGame: false },
        { gameId: "fourfieldkono", variantId: "standard", isDrawGame: true },
        { gameId: "foxandhounds", variantId: "regular", isDrawGame: false },
        { gameId: "graphgame", variantId: "2", isDrawGame: false },
        { gameId: "0to10by1or2", variantId: "regular", isDrawGame: false },
        { gameId: "allqueenschess", variantId: "standard", isDrawGame: false },
        { gameId: "lightsout", variantId: "8", isDrawGame: false },
        { gameId: "nqueens", variantId: "8", isDrawGame: false },
        { gameId: "pegsolitaire", variantId: "triangle", isDrawGame: false },
        { gameId: "rushhour", variantId: "expert", isDrawGame: false },
        { gameId: "npuzzle", variantId: "3", isDrawGame: false },
        { gameId: "toadsandfrogspuzzle", variantId: "4", isDrawGame: false },
        { gameId: "towersofhanoi", variantId: "3_6", isDrawGame: false },
        { gameId: "rubikscube", variantId: "2x2x2", isDrawGame: false },
        { gameId: "bishoppuzzle", variantId: "4x5_8", isDrawGame: false },
        { gameId: "quickcross", variantId: "regular", isDrawGame: true },
        { gameId: "dao", variantId: "regular", isDrawGame: true },
        { gameId: "sim", variantId: "regular", isDrawGame: false },
        { gameId: "snake", variantId: "regular", isDrawGame: false },
        { gameId: "tactix", variantId: "regular", isDrawGame: false },
        { gameId: "mutorere", variantId: "regular", isDrawGame: true },
        { gameId: "dragonsandswans", variantId: "3", isDrawGame: false },
        { gameId: "shifttactoe", variantId: "default", isDrawGame: false },
        { gameId: "y", variantId: "dim5", isDrawGame: false },    
        { gameId: "lgame", variantId: "regular", isDrawGame: true },
        { gameId: "tictactwo", variantId: "regular", isDrawGame: false },
        { gameId: "chungtoi", variantId: "regular", isDrawGame: true },
        { gameId: "dawsonschess", variantId: "15", isDrawGame: true },
        { gameId: "tootandotto", variantId: "6", isDrawGame: false },
        { gameId: "1dchess", variantId: "regular", isDrawGame: false },
        { gameId: "fivefieldkono", variantId: "delta", isDrawGame: true },
        { gameId: "3spot", variantId: "regular", isDrawGame: false },
        { gameId: "achi", variantId: "regular", isDrawGame: false },
        { gameId: "beeline", variantId: "regular", isDrawGame: true },
        { gameId: "chomp", variantId: "4x7", isDrawGame: false },
        { gameId: "ninemensmorris", variantId: "regular", isDrawGame: true },
        { gameId: "connect4", variantId: "6x7", isDrawGame: false },
        { gameId: "dinododgem", variantId: "regular", isDrawGame: true },
        { gameId: "dodgem", variantId: "regular", isDrawGame: false },
        { gameId: "hareandhounds", variantId: "m-hounds-first", isDrawGame: false },
        { gameId: "baghchal", variantId: "regular", isDrawGame: true },
        { gameId: "lite3", variantId: "three-in-a-row", isDrawGame: false },
        { gameId: "notakto", variantId: "board3", isDrawGame: false },
        { gameId: "othello", variantId: "regular", isDrawGame: false }
    ];

    const currentGameIndex = ref(0);
    const initiateCurrentGame = async () => {
        store.dispatch(actionTypes.exitMatch);
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
    const isEndOfMatch = computed(() => store.getters.isEndOfMatch || isEndOfDrawMatch.value || store.getters.currentRoundId > 99);
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
            if (++currRep.value >= repeat) {
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
        > .dvvh {
            width: 60%;
        }
        > .dbody {
            width: 35%;
        }
    }
</style>
