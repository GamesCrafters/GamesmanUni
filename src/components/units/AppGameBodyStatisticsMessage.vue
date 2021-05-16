<template>
    <div id="app-game-body-statistics-message" v-if="showNextMoveHints">
        <template v-if="currentRemoteness">
            <p v-if="currentPositionValue === 'draw'">
                <b class="uni-turn-1">Left Player: {{ currentLeftPlayerName }}</b> and Right Player: <b class="uni-turn-2">{{ currentRightPlayerName }}</b> are in a <span :class="`uni-${currentPositionValue}`">draw</span>!
            </p>
            <p v-else>
                <b :class="`uni-turn-${currentTurn}`">{{ currentTurn === 1 ? "Left" : "Right" }} Player: {{ currentPlayerName }}</b> should <span :class="`uni-${currentPositionValue}`">{{ currentPositionValue }}</span> the game.
            </p>
        </template>
        <template v-else>
            <p v-if="currentPositionValue === 'win'">
                <b :class="`uni-turn-${currentTurn}`">{{ currentTurn === 1 ? "Left" : "Right" }} Player: {{ currentPlayerName }}</b> has <span :class="`uni-${currentPositionValue}`">won</span> the game!
            </p>
            <p v-else-if="currentPositionValue === 'tie'">
                <b class="uni-turn-1">Left Player: {{ currentLeftPlayerName }}</b> and <b class="uni-turn-2">Right Player: {{ currentRightPlayerName }}</b> have <span :class="`uni-${currentPositionValue}`">tied</span> the game!
            </p>
            <p v-else-if="currentPositionValue === 'lose'">
                <b :class="`uni-turn-${currentTurn}`">{{ currentTurn === 1 ? "Left" : "Right" }} Player: {{ currentPlayerName }}</b> has <span :class="`uni-${currentPositionValue}`">lost</span> the game!
            </p>
            <p v-else>
                <b :class="`uni-turn-${currentTurn}`">{{ currentTurn === 1 ? "Left" : "Right" }} Player: {{ currentPlayerName }}</b> should <span :class="`uni-${currentPositionValue}`">{{ currentPositionValue }}</span> the game.
            </p>
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../scripts/plugins/store";

    const store = useStore();
    const currentTurn = computed(() => store.getters.currentTurn);
    const options = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.options : undefined));
    const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));
    const currentLeftPlayerName = computed(() => store.getters.currentLeftPlayer.name);
    const currentRightPlayerName = computed(() => store.getters.currentRightPlayer.name);
    const currentPlayerName = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.name : ""));
    const currentRemoteness = computed(() => store.getters.currentRemoteness);
    const currentPositionValue = computed(() => store.getters.currentPositionValue);
</script>

<style lang="scss" scoped>
    #app-game-body-statistics-message {
        border-radius: 1rem;
        border: 0.1rem solid var(--neutralColor);
        > p {
            padding: 1rem;
            text-align: center;
            > b,
            span {
                border-radius: 1rem;
                border: 0.1rem solid var(--primaryColor);
                padding: 0 0.5rem;
            }
        }
    }
</style>
