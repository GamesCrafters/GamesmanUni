<template>
    <component v-if="autoguiPosition === ''" :is="LoadingScreen"/>
    <component v-else-if="customGameBoardExists" :is="customGUIs[gameId]" />
    <component v-else :is="ImageAutoGUI" />
</template>

<script lang="ts" setup>
    import { computed, watch } from "vue";
    import { useStore, mutationTypes } from "../../../scripts/plugins/store";
    import LoadingScreen from "../LoadingScreen.vue"
    import ImageAutoGUI from "./ImageAutoGUI.vue";
    import CustomGUITicTacToe from "./CustomGUITicTacToe.vue";
    import CustomGUIQuarto from "./CustomGUIQuarto.vue";
    import CustomGUISim from "./CustomGUISim.vue";
    import { Rounds } from "../../../scripts/gamesmanUni/types";
    import { deepcopy } from "../../../scripts/gamesmanUni/index";

    const store = useStore();
    const autoguiPosition = computed(() => store.getters.currentAutoguiPosition);
    const currentMatch = computed(() => (store.state.app.currentMatch ? store.state.app.currentMatch : undefined));
    const gameId = computed(() => (currentMatch.value ? currentMatch.value.gameId : ""));
    const customGUIs: Record<string, any> = {
        "tictactoe": CustomGUITicTacToe,
        "quarto": CustomGUIQuarto,
        "sim": CustomGUISim
    };
    const customGameBoardExists = computed(() => gameId.value in customGUIs);

    const isEndOfMatch = computed(() => store.getters.isEndOfMatch);

    watch(
        () => isEndOfMatch.value,
        async () => {
            if (isEndOfMatch.value) {
                const currentValuedRound = computed(() => store.getters.currentValuedRounds);
                const currentRoundId = computed(() => store.getters.currentRoundId);
                const currentPositionValue = computed(() => store.getters.currentPositionValue);
                const variantId = computed(() => store.getters.currentVariantId);
                
                const gameName = computed(() => (store.getters.game(gameId.value) ? store.getters.game(gameId.value).name : ""));
                const variantName = computed(() => (store.getters.game(gameId.value) && store.getters.variant(gameId.value, variantId.value) ? store.getters.variant(gameId.value, variantId.value).name : ""));
                const leftPlayer = computed(() => store.getters.currentLeftPlayer);
                const rightPlayer = computed(() => store.getters.currentRightPlayer);
                const leftPlayerWins = determineLeftPlayerWins(currentValuedRound.value, currentRoundId.value, currentPositionValue.value);
                const moveHistory = computed(() => store.getters.moveHistory);
                const CPUsStrategies = computed(() => store.getters.currentCPUsStrategies);
                const CPUsRatings = computed(() => store.getters.currentCPUsRatings);

                const scorecardRecord = {
                    gameName: gameName.value,
                    variantName: variantName.value,
                    leftPlayer: deepcopy(leftPlayer.value),
                    rightPlayer: deepcopy(rightPlayer.value), 
                    leftPlayerWon: leftPlayerWins, 
                    CPUsStrategies: [...CPUsStrategies.value],
                    CPUsRatings: [...CPUsRatings.value],
                    moveHistory: moveHistory.value
                };
                
                store.commit(mutationTypes.addScorecardRecord, scorecardRecord);
                }
            },
    );

    const determineLeftPlayerWins = (currentValuedRounds: Rounds, roundID: number, positionValue: string) => {
        const playerTurn = currentValuedRounds[roundID].firstPlayerTurn ? 1 : 2;
        if (playerTurn == 1 && positionValue === 'win' || playerTurn == 2 && positionValue === 'lose') {
            return true;
        }
        return false;
    }
</script>
