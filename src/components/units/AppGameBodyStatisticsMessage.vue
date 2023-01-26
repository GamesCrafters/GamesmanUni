<template>
    <div id="app-game-body-statistics-message" v-if="showNextMoveHints">
        <template v-if="currentRemoteness != 0">
            <p v-if="!isPuzzleGame && currentPositionValue === 'draw'">
                <b class="uni-turn-1">{{ currentLeftPlayerName }}</b> and <b class="uni-turn-2">{{ currentRightPlayerName }}</b> are in a <mark :class="`uni-${currentPositionValue}`">draw</mark>!
            </p>
            <p v-else-if="!isPuzzleGame">
                <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> should <mark :class="`uni-${currentPositionValue}`">{{ currentPositionValue }}</mark> the game in {{ currentRemoteness }} move<span v-if="currentRemoteness !== 1">s</span>. {{ mexStr }}
            </p>
            <p v-else>
                <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> should <mark :class="`uni-win`">solve</mark> the puzzle in {{ currentRemoteness }} move<span v-if="currentRemoteness !== 1">s</span>.
            </p> 
        </template>
        <template v-else>
            <p v-if="!isPuzzleGame && currentPositionValue === 'win'">
                <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> has <mark :class="`uni-${currentPositionValue}`">won</mark> the game! {{ mexStr }}
            </p>
            <p v-else-if="!isPuzzleGame && currentPositionValue === 'tie'">
                <b class="uni-turn-1">{{ currentLeftPlayerName }}</b> and <b class="uni-turn-2">{{ currentRightPlayerName }}</b> have <mark :class="`uni-${currentPositionValue}`">tied</mark> the game!
            </p>
            <p v-else-if="!isPuzzleGame && currentPositionValue === 'lose'">
                <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> has <mark :class="`uni-${currentPositionValue}`">lost</mark> the game! {{ mexStr }}
            </p>
            <p v-else-if="isPuzzleGame">
                <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> has <mark :class="`uni-win`">solved</mark> the puzzle!
            </p>
            <p v-else>
                <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> has <mark :class="`uni-${currentPositionValue}`">{{ currentPositionValue }}</mark> the game! {{ mexStr }}
            </p>
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../scripts/plugins/store";

    const store = useStore();
    const isPuzzleGame = computed(() => store.getters.currentGameType === "puzzles");
    const isEndOfMatch = computed(() => store.getters.isEndOfMatch);
    const currentTurn = computed(() => (isPuzzleGame.value ? 1 : store.getters.currentPlayer ? (store.getters.currentPlayer.id === store.getters.currentLeftPlayer.id ? 1 : 2) : 0));
    const options = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.options : undefined));
    const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));
    const currentLeftPlayerName = computed(() => store.getters.currentLeftPlayer.name);
    const currentRightPlayerName = computed(() => store.getters.currentRightPlayer.name);
    const currentPlayerName = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.name : ""));
    const currentRemoteness = computed(() => store.getters.currentRemoteness);
    const currentPositionValue = computed(() => store.getters.currentPositionValue);
    const mexStr = computed(() => (store.getters.currentPositionMex !== "") ? "[Grundy #: " + store.getters.currentPositionMex + "]" : "");
</script>

<style lang="scss" scoped>
    #app-game-body-statistics-message {
        border-radius: 1rem;
        border: 0.1rem solid var(--neutralColor);
        > p {
            padding: 1rem;
            text-align: center;
            > mark {
                border-radius: 1rem;
                padding: 0.25rem 0.5rem;
            }
        }
    }
</style>
