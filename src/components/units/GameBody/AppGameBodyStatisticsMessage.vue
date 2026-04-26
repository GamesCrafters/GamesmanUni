<template>
    <div id="app-game-body-statistics-message">
        <!-- If move hints are off and game hasn't ended, show an uninformative message. -->
        <template v-if="!showNextMoveHints && !isEndOfMatch">
            <p>It is <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b>'s turn.</p>
        </template>

        <!-- Move hints are on and game is ongoing... -->
        <template v-else-if="!isEndOfMatch">
            <template v-if="isPuzzleGame">
                <p v-if="currentPositionValue === 'lose'">
                    <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> will
                    <mark :class="`uni-lose`">not be able to solve</mark> the puzzle.
                </p>
                <p v-else>
                    <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> {{ currentPlayerIsComputer ? "will" : "should" }}
                    <mark :class="`uni-win`">solve</mark> the puzzle in {{ currentRemoteness }}
                    move{{ currentRemoteness == 1 ? "" : "s"}}.
                </p>
            </template>
            <template v-else>
                <p v-if="currentPositionValue === 'draw'">
                    <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> should <mark :class="`uni-${currentPositionValue}`">draw</mark> <b :class="`uni-turn-${currentOppTurn}`">{{ currentOpponentName }}</b>.
                    <span v-if="currentDrawLevel != -1">
                    <br/>The current position is a L{{ currentDrawLevel }}R{{ currentDrawRemoteness }} <mark :class="`uni-${currentPositionValue}`"> draw </mark> <mark :class="`uni-${currentDrawValue}`"> {{currentDrawValue}}</mark>,<br/>
                    i.e., <b :class="`uni-turn-${drawLosingTurn}`">{{ drawLosingPlayer }}</b>
                    <span v-if="currentDrawRemoteness == 0"> is at the draw level {{ currentDrawLevel }} fringe.</span>
                    <span v-else> can be forced to the draw level {{ currentDrawLevel }} fringe in {{ currentDrawRemoteness }} move{{ currentDrawRemoteness == 1 ? "" : "s"}}.</span></span>
                </p>
                <p v-else-if="currentPositionValue === 'unsolved'">
                    <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b>'s turn.
                </p>
                <p v-else>
                    <mark :class="`uni-${currentPositionValue} value-badge`">
                        {{ currentPositionValue === 'tie' ? 'Tie' : (currentPositionValue === 'win' ? 'Win' : 'Lose') }}
                        <span v-if="currentRemoteness != Remoteness.FINITE_UNKNOWN"> in {{ currentRemoteness }} move{{ currentRemoteness == 1 ? "" : "s" }}{{ winbyStr }}</span>
                    </mark>
                    <span class="mex-str" v-if="mexStr">{{ mexStr }}</span>
                </p>
            </template>
        </template>

        <!-- Game Over -->
        <template v-else>
            <template v-if="isPuzzleGame">
                <p v-if="currentPositionValue === 'lose'">
                    <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> was
                    <mark :class="`uni-lose`">unable to solve</mark> the puzzle.
                </p>
                <p v-else>
                    <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> has
                    <mark :class="`uni-win`">solved</mark> the puzzle.
                </p>
            </template>
            <template v-else>
                <p v-if="currentPositionValue === 'win'">
                    <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> has
                    <mark :class="`uni-${currentPositionValue}`">won</mark> the game{{ winbyStr }}. {{ mexStr }}
                </p>
                <p v-else-if="currentPositionValue === 'tie'">
                    <b class="uni-turn-1">{{ currentLeftPlayerName }}</b> and
                    <b class="uni-turn-2">{{ currentRightPlayerName }}</b> have
                    <mark :class="`uni-${currentPositionValue}`">tied</mark> the game.
                </p>
                <p v-else>
                    <b :class="`uni-turn-${currentTurn}`">{{ currentPlayerName }}</b> has
                    <mark :class="`uni-${currentPositionValue}`">lost</mark> the game{{ winbyStr }}. {{ mexStr }}
                </p>
            </template>
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../../scripts/plugins/store";
    import * as Remoteness from "../../../scripts/gamesmanUni/remoteness";

    const store = useStore();
    const isPuzzleGame = computed(() => store.getters.currentGameType === "puzzles");
    const currentTurn = computed(() => (store.getters.currentMatch.round.firstPlayerTurn ? 1 : 2));
    const currentOppTurn = computed(() => currentTurn.value == 1 ? 2 : 1);
    const options = computed(() => store.getters.options);
    const showNextMoveHints = computed(() => (options.value ? options.value.showNextMoveHints : true));
    const currentLeftPlayerName = computed(() => store.getters.currentLeftPlayer.name);
    const currentRightPlayerName = computed(() => store.getters.currentRightPlayer.name);
    const currentPlayerName = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.name : ""));
    const currentOpponentName = computed(() => currentOppTurn.value == 1 ? currentLeftPlayerName.value : currentRightPlayerName.value);
    const currentPlayerIsComputer = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.isComputer : false));
    const currentRemoteness = computed(() => store.getters.currentRemoteness);
    const currentPositionValue = computed(() => store.getters.currentPositionValue);
    const isEndOfMatch = computed(() => store.getters.isEndOfMatch);
    const currentDrawValue = computed(() => store.getters.currentPositionDrawRemoteness % 2 == 0 ? "lose": "win");
    const currentDrawRemoteness = computed(() => store.getters.currentPositionDrawRemoteness);
    const currentDrawLevel = computed(() => store.getters.currentPositionDrawLevel);
    const currentWinBy = computed(() => store.getters.currentWinBy);
    const mexStr = computed(() => (store.getters.currentPositionMex !== "") ? "[Grundy #: " + store.getters.currentPositionMex + "]" : "");
    const winbyStr = computed(() => (isEndOfMatch ? "" : " or") + (currentWinBy.value ? " by " + currentWinBy.value : ""));
    const drawLosingTurn = computed(() => currentDrawRemoteness.value % 2 == 0 ? currentTurn.value : currentOppTurn.value);
    const drawLosingPlayer = computed(() => drawLosingTurn.value == 1 ? currentLeftPlayerName.value : currentRightPlayerName.value);
</script>

<style lang="scss" scoped>
    #app-game-body-statistics-message {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        > p {
            font-size: 13px;
            color: var(--gu-text-body);
            text-align: right;

            mark {
                border-radius: 6px;
                padding: 2px 8px;
                font-size: 12px;
                font-weight: 500;
            }

            .value-badge {
                display: inline-block;
                border-radius: 6px;
                padding: 3px 10px;
                font-size: 12px;
                font-weight: 600;
            }
        }

        .mex-str {
            font-size: 11px;
            color: var(--gu-text-muted);
            margin-left: 6px;
        }
    }
</style>
