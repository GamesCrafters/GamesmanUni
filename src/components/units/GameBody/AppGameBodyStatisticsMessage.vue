<template>
    <div id="app-game-body-statistics-message" v-if="showNextMoveHints">
        <!-- Game not over -->
        <template v-if="currentRemoteness != 0">
            <!-- Games: Special handling if current position is drawing -->
            <p v-if="!isPuzzleGame && currentPositionValue === 'draw'">
                <b class="uni-turn-1">{{ currentLeftPlayerName }}</b> and 
                <b class="uni-turn-2">{{ currentRightPlayerName }}</b> are in a 
                <mark :class="`uni-${currentPositionValue}`">draw</mark>!
                <span v-if="currentDrawLevel != -1">
                    <br/>
                    The current position is a 
                    <mark :class="`uni-${currentPositionValue}`"> draw </mark>
                    <mark :class="`uni-${currentDrawValue}`"> {{currentDrawValue}}</mark>.
                    <br/>
                        <strong> Draw Level: </strong> <mark :class="`uni-${currentPositionValue}`">{{ currentDrawLevel }}  </mark> ;
                        Draw Remoteness: <mark :class="`uni-${currentPositionValue}`"> {{currentDrawRemoteness}}</mark>
                </span>
            </p>
            <!-- Games: Special handling if current position is unsolved -->
            <p v-else-if="!isPuzzleGame && currentPositionValue === 'unsolved'">
                <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b>'s
                turn. {{ mexStr }}
            </p>
            <!-- Games: win/lose/tie in <remoteness> moves -->
            <p v-else-if="!isPuzzleGame">
                <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b>
                {{ currentPlayerIsComputer ? "will" : "should" }} 
                <mark :class="`uni-${currentPositionValue}`">{{ currentPositionValue }}</mark> 
                the game in {{ currentRemoteness }} 
                {{ currentRemoteness == 1 ? "move" : "moves" }}{{ currentWinBy ? " or by " + currentWinBy : "" }}.
                {{ mexStr }}
            </p>
            <!-- Puzzles: solve the puzzle in <remoteness> moves -->
            <p v-else>
                <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b>
                {{ currentPlayerIsComputer ? "will" : "should" }} 
                <mark :class="`uni-win`">solve</mark> the puzzle in {{ currentRemoteness }} 
                {{ currentRemoteness == 1 ? "move" : "moves" }}.
            </p> 
        </template>

        <!-- Game over -->
        <template v-else>
            <p v-if="!isPuzzleGame && currentPositionValue === 'win'">
                <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> has 
                <mark :class="`uni-${currentPositionValue}`">won</mark>
                the game{{ currentWinBy ? " by " + currentWinBy : "" }}! {{ mexStr }}
            </p>
            <p v-else-if="!isPuzzleGame && currentPositionValue === 'tie'">
                <b class="uni-turn-1">{{ currentLeftPlayerName }}</b> and 
                <b class="uni-turn-2">{{ currentRightPlayerName }}</b> have 
                <mark :class="`uni-${currentPositionValue}`">tied</mark> the game!
            </p>
            <p v-else-if="!isPuzzleGame && currentPositionValue === 'lose'">
                <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> has 
                <mark :class="`uni-${currentPositionValue}`">lost</mark>
                the game{{ currentWinBy ? " by " + currentWinBy : "" }}! {{ mexStr }}
            </p>
            <p v-else-if="isPuzzleGame">
                <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> has 
                <mark :class="`uni-win`">solved</mark> the puzzle!
            </p>
            <p v-else>
                <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> has 
                <mark :class="`uni-${currentPositionValue}`">{{ currentPositionValue }}</mark> 
                the game! {{ mexStr }}
            </p>
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../../scripts/plugins/store";

    const store = useStore();
    const isPuzzleGame = computed(() => store.getters.currentGameType === "puzzles");
    const currentTurn = computed(() => (store.getters.currentMatch.round.firstPlayerTurn ? 1 : 2));
    const options = computed(() => store.getters.options);
    const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));
    const currentLeftPlayerName = computed(() => store.getters.currentLeftPlayer.name);
    const currentRightPlayerName = computed(() => store.getters.currentRightPlayer.name);
    const currentPlayerName = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.name : ""));
    const currentPlayerIsComputer = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.isComputer : false));
    const currentRemoteness = computed(() => store.getters.currentRemoteness);
    const currentPositionValue = computed(() => store.getters.currentPositionValue);
    const currentDrawValue = computed(() => store.getters.currentPositionDrawRemoteness % 2 == 0 ? "lose": "win");
    const currentDrawRemoteness = computed(() => store.getters.currentPositionDrawRemoteness);
    const currentDrawLevel = computed(() => store.getters.currentPositionDrawLevel);
    const currentWinBy = computed(() => store.getters.currentWinBy);
    const mexStr = computed(() => (store.getters.currentPositionMex !== "") ? "[Grundy #: " + store.getters.currentPositionMex + "]" : "");
</script>

<style lang="scss" scoped>
    #app-game-body-statistics-message {
        border-radius: 1rem;
        border: 0.1rem solid var(--neutralColor);
        > p {
            padding: 1rem;
            text-align: center;
            mark {
                border-radius: 1rem;
                padding: 0.25rem 0.5rem;
            }
        }        
    }
</style>
