<template>
    <div id="app-game-vvh-body-columnview">
        <table>
            <tr class="table-headers" v-if="toggleGuides">
                <td>Move</td>
                <td>Value</td>
                <td v-if="showDrawLevelColumn">Draw Level</td>
                <td v-if="showRemotenessColumn">Remoteness</td>
                <td v-if="showWinByColumn && supportsWinBy">Win By</td>
            </tr>
            <template v-if="currentRoundId >= 1 && !currentMatch.computerMoving">
                <tr v-for="nextMove in currentRounds[currentRoundId].position.availableMoves" class="moves"
                    :class="[(options.highlightMove && highlightedMove === nextMove.autoguiMove) ? 'highlighted' : '']"
                    @click="store.dispatch(actionTypes.runMove, { autoguiMove: nextMove.autoguiMove })"
                    @mouseover="store.commit(mutationTypes.setHighlightedMove, nextMove.autoguiMove)"
                    @mouseout="store.commit(mutationTypes.setHighlightedMove, '')">
                <td>{{ nextMove.move }}</td>
                    <td
                        :class="[nextMove.moveValue]">
                    {{ nextMove.moveValue }}
                    </td>
                    <template v-if="showDrawLevelColumn">
                        <td v-if="nextMove.drawLevel >= 0">{{ nextMove.drawLevel }}</td>
                        <td v-else> - </td>
                    </template>
                    <template v-if="showRemotenessColumn">
                        <td v-if="nextMove.drawLevel >= 0">{{ nextMove.drawRemoteness }}</td>
                        <td v-else>{{ (nextMove.moveValue === 'unsolved') ? '-' : (nextMove.moveValue == 'draw') ? "∞" : nextMove.remoteness }}</td>
                    </template>
                    <template v-if="showWinByColumn">
                        <td v-if="supportsWinBy">{{ nextMove.winby }}</td>
                    </template>
                </tr>
            </template>
        </table>
        <template v-if="currentMatch.computerMoving">
            ... Making Move ...
        </template>
        <template v-if="isEndOfMatch">
            No moves available.
        </template>
        <div id="view-options" v-if="toggleOptions">
            <div class="view-option">
                <div class="wrapper">
                    <input class="uni-toggle-button"
                        aria-label="toggle"
                        type="checkbox"
                        v-model="showDrawLevelColumn"
                    />
                    <label for="checkbox">Toggle Draw Level Column</label>
                </div>
            </div>
            <div class="view-option">
                <div class="wrapper">
                    <input class="uni-toggle-button"
                        aria-label="toggle"
                        type="checkbox"
                        v-model="showRemotenessColumn"
                    />
                    <label for="checkbox">Toggle Remoteness Column</label>
                </div>
            </div>
            <div class="view-option" v-if="supportsWinBy">
                <div class="wrapper">
                    <input class="uni-toggle-button"
                        aria-label="toggle"
                        type="checkbox"
                        v-model="showWinByColumn"
                    />
                    <label for="checkbox">Toggle Win By Column</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref } from "vue";
    import { mutationTypes, actionTypes, useStore } from "../../../scripts/plugins/store";

    defineProps({
        toggleOptions: Boolean,
        toggleScrolling: Boolean,
        toggleGuides: Boolean,
    });

    const store = useStore();
    const options = computed(() => store.getters.options);
    const isEndOfMatch = computed(() => store.getters.isEndOfMatch);
    const currentMatch = computed(() => store.getters.currentMatch);
    const currentRoundId = computed(() => store.getters.currentRoundId);
    const currentRounds = computed(() => store.getters.currentRounds);
    const currentGameId = computed(() => store.getters.currentGameId);

    const supportsWinBy = computed(() =>
        currentGameId.value ? store.getters.supportsWinBy(currentGameId.value) : false
    );

    const highlightedMove = computed(() => store.getters.currentHighlightedMove);

    const showDrawLevelColumn = ref(true);
    const showRemotenessColumn = ref(true);
    const showWinByColumn = ref(true);
</script>

<style lang="scss" scoped>
    #app-game-vvh-body-columnview {
        
        table {
            width: 100%;
        }

        table tr td {
            border-bottom: 1px solid #ddd;
            text-align: center;
        }

        td {
            padding: 0.5rem;
        }

        .table-headers {
            position: sticky;
        }

        .moves {
            &:hover {
                cursor: pointer;
                background-color: #f0f8ff;
            }

            &.highlighted {
                outline: 2px solid var(--moveHighlightColor);
                background-color: #f0f8ff;
            }  
        }

        .draw {
            background-color: var(--drawColor);
        }

        .tie {
            background-color: var(--tieColor);
        }

        .lose {
            background-color: var(--loseColor);
            color: white;
        }

        .win {
            background-color: var(--winColor);
            color: white;
        }

        .unsolved {
            background-color: var(--unsolvedColor);
            color: white;
        }
    }

    #view-options {
        display: flex;
        justify-content: center;
        margin-top: 1rem;
        margin-bottom: 1rem;
        gap: 1rem;

        .view-option {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .wrapper {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    }
</style>