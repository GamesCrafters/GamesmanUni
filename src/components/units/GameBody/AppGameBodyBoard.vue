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
    import * as GMUTypes from "../../../scripts/gamesmanUni/types";

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
            if (isEndOfMatch.value && store.state.app.currentMatch.round.position.position != "") {
                const currentValuedRounds = computed(() => store.getters.currentValuedRounds);
                const currentRoundId = computed(() => store.getters.currentRoundId);
                const currentPositionValue = computed(() => store.getters.currentPositionValue);
                const variantId = computed(() => store.getters.currentVariantId);
                
                const currentTotalWins = computed(() => store.getters.currentTotalWins);
                const currentPlayerWinsMap = computed(() => store.getters.currentPlayerWinsMap);
                
                const gameName = computed(() => (store.getters.game(gameId.value) ? store.getters.game(gameId.value).name : ""));
                const variantName = computed(() => (store.getters.game(gameId.value) && store.getters.variant(gameId.value, variantId.value) ? store.getters.variant(gameId.value, variantId.value).name : ""));
                const leftPlayer = computed(() => store.getters.currentLeftPlayer);
                const rightPlayer = computed(() => store.getters.currentRightPlayer);
                const leftPlayerEndPosition = computed(() => determineLeftPlayerPositionValue(currentValuedRounds.value, currentRoundId.value, currentPositionValue.value));
                const moveHistory = computed(() => store.getters.moveHistory);
                const CPUsStrategies = computed(() => store.getters.currentCPUsStrategies);
                const CPUsRatings = computed(() => store.getters.currentCPUsRatings);

                /* Initialize player ratings */
                const leftPlayerRatings: GMUTypes.Rating = {
                    brilliant: 0,
                    good: 0,
                    blunder: 0
                };
                const rightPlayerRatings: GMUTypes.Rating = {
                    brilliant: 0,
                    good: 0,
                    blunder: 0
                };
                
                const moveHistoryRatings : number[] = [];
                const stringMoveHistory : string[] = [];


                /* Calculate player ratings */
                for (const round of currentValuedRounds.value.slice(1)) {
                    const leftValue = determineLeftPlayerPositionValue(currentValuedRounds.value, round.id, round.position.positionValue);
                    const playerTurn = round.firstPlayerTurn ? 1 : 2;
                    const playerMove = round.move;
                    stringMoveHistory.push(playerMove);
                    const playerRatings = playerTurn == 1 ? leftPlayerRatings : rightPlayerRatings;
                    const winning = (leftValue === "win" && playerTurn == 1 || leftValue === "lose" && playerTurn == 2) ? true : false;
                    const availableMoves = round.position.availableMoves;
                    if (Object.values(availableMoves).length === 0) {
                        break;
                    }
                    const sortedMoves = Object.values(availableMoves).sort((a, b) => {
                        if (a.remoteness === b.remoteness) return +!!((a.moveValue === "win"))* (b.winby - a.winby)
                        return a.remoteness - b.remoteness
                    });
                    const currMove = Object.values(availableMoves).find(mov => mov.move === playerMove);
                    if (currMove === undefined) {
                        console.log("error");
                        break;
                    }
                    // WINNING POSITIONS:
                    // BRILLIANT: if lowest remoteness ++ highest win-by
                    // GOOD: if winning --> winning
                    // BLUNDER: if winning --> losing

                    // TIE POSITIONS:
                    // BRILLIANT: remoteness -= 1 (still tie)
                    // GOOD: stays tie
                    // BLUNDER: tie -> lose  

                    // LOSING POSITIONS:
                    // BRILLIANT: if losing --> winning (or tie, if winning not availbale) / highest remoteness ++ lowest win-by
                    // GOOD: if remoteness -= 1 (doesn't accelerate losing)
                    // BLUNDER: if remoteness change > 1
                    /* Move Values (moveHistory) */
                    const blunder = () => {
                        moveHistoryRatings.push(0);
                        playerRatings.blunder++;
                    };
                    const good = () => {
                        moveHistoryRatings.push(1);
                        playerRatings.good++;
                    };
                    const brilliant = () => {
                        moveHistoryRatings.push(2);
                        playerRatings.brilliant++;
                    };
                    if (leftValue === "draw") {
                        // BLUNDER
                        if (currMove.moveValue != "draw") {blunder();}
                        // GOOD
                        else {good();}
                    }
                    else if (winning) {
                        // BLUNDER
                        if (currMove.moveValue != "win") {blunder();}
                        // BRILLIANT
                        else if (currMove.remoteness <= sortedMoves[0].remoteness && 
                            currMove.winby >= sortedMoves[0].winby) {brilliant();}
                        // GOOD
                        else {good();}
                        
                    } else if (leftValue === "tie"){
                        // BLUNDER
                        if (currMove.moveValue === "lose") {blunder();}
                        // BRILLIANT
                        else if (currMove.remoteness < round.position.remoteness) {brilliant();}
                        // GOOD
                        else {good();}                        
                    } else {
                        const stallMove = sortedMoves.at(-1);
                        if (stallMove === undefined) {
                            break;
                        }
                        const winExists = sortedMoves.some(move => move.moveValue === "win");
                        if (winExists && currMove.moveValue != "win") {blunder();}
                        // BRILLIANT
                        else if (currMove.moveValue === "win" || (currMove.remoteness >= stallMove.remoteness && 
                            currMove.winby <= stallMove.winby)) {brilliant();}
                        // GOOD
                        else if (currMove.remoteness === round.position.remoteness - 1) {good();}
                        // BLUNDER
                        else {blunder();}
                    }
                }           

                const scorecardRecord = {
                    gameName: gameName.value,
                    variantName: variantName.value,
                    leftPlayer: deepcopy(leftPlayer.value),
                    rightPlayer: deepcopy(rightPlayer.value), 
                    leftPlayerEndPosition: leftPlayerEndPosition.value, 
                    CPUsStrategies: [...CPUsStrategies.value],
                    CPUsRatings: [...CPUsRatings.value],
                    moveHistory: moveHistory.value,
                    stringMoveHistory: deepcopy(stringMoveHistory),
                    moveHistoryRatings: deepcopy(moveHistoryRatings),
                    leftPlayerRatings: leftPlayerRatings,
                    rightPlayerRatings: rightPlayerRatings,
                };

                if(!currentPlayerWinsMap.value.has(leftPlayer.value.name)) {
                    store.commit(mutationTypes.setPlayerWinsEntry, {player: leftPlayer.value.name, wins: 0});
                }

                if(!currentPlayerWinsMap.value.has(rightPlayer.value.name)) {
                    store.commit(mutationTypes.setPlayerWinsEntry, {player: rightPlayer.value.name, wins: 0});
                }
                if (leftPlayerEndPosition.value === "win") {
                        store.commit(mutationTypes.setPlayerWinsEntry, {player: leftPlayer.value.name, wins: (currentPlayerWinsMap.value.get(leftPlayer.value.name) || 0) + 1});
                        store.commit(mutationTypes.setGamesPlayed, currentTotalWins.value + 1);
                }
                
                if (leftPlayerEndPosition.value === "lose") {
                        store.commit(mutationTypes.setPlayerWinsEntry, {player: rightPlayer.value.name, wins: (currentPlayerWinsMap.value.get(rightPlayer.value.name) || 0) + 1});
                        store.commit(mutationTypes.setGamesPlayed, currentTotalWins.value + 1);
                }

                
                store.commit(mutationTypes.addScorecardRecord, scorecardRecord);
                }
            },
    );
    
    /**
     * Determines the position value of the left player at the specified round based on the current positionValue. 
     * Returns "win", "lose", or "tie" depending on whether the left player is winning, loosing, or tied at the specified round roundID.
     * @param currentValuedRounds 
     * @param roundID 
     * @param positionValue 
     * @returns the left players position value.
     */
    const determineLeftPlayerPositionValue = (currentValuedRounds: Rounds, roundID: number, positionValue: string) => {
        if (positionValue === "draw") return "draw";
        const playerTurn = currentValuedRounds[roundID].firstPlayerTurn ? 1 : 2;
        if (playerTurn == 1 && positionValue === "win" || playerTurn == 2 && positionValue === "lose") {
            return "win";
        } else if (positionValue === "tie") {
            return "tie";
        }
        return "lose";
    }
</script>
