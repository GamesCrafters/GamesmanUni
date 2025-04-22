<template>
    <div id="app-game-vvh-body-columnview">
        <table>
            <tr class="table-headers" v-if="toggleGuides">
                <td>Move</td>
                <td>Value</td>
                <td>Draw Level</td>
                <td>Remoteness</td>
                <td v-if="supportsWinBy">Win By</td>
            </tr>
            <template v-if="currentRoundId >= 1 && !currentMatch.computerMoving">
                <tr v-for="nextMove in currentRounds[currentRoundId].position.availableMoves" class="moves"
                    :class="[(options.highlightMove && highlightedMove === nextMove.move) ? 'highlighted' : '']"
                    @click="store.dispatch(actionTypes.runMove, { autoguiMove: nextMove.move })"
                    @mouseover="store.commit(mutationTypes.setHighlightedMove, nextMove.move)"
                    @mouseout="store.commit(mutationTypes.setHighlightedMove, '')">
                <td>{{ nextMove.move }}</td>
                    <td
                        :class="[nextMove.moveValue]">
                    {{ nextMove.moveValue }}
                    </td>
                    <td v-if="nextMove.drawLevel >= 0">{{ nextMove.drawLevel }}</td>
                    <td v-else> - </td>
                    <td v-if="nextMove.drawLevel >= 0">{{ nextMove.drawRemoteness }}</td>
                    <td v-else>{{ (nextMove.moveValue === 'unsolved') ? '-' : nextMove.remoteness }}</td>
                    <td v-if="supportsWinBy">{{ nextMove.winby }}</td>
                </tr>
            </template>
        </table>
        <template v-if="currentMatch.computerMoving">
            ... Making Move ...
        </template>
        <template v-if="isEndOfMatch">
            No moves available.
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
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
</style>