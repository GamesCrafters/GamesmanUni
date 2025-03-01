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
            <template v-if="currentValuedRoundId >= 1">
                <tr v-for="nextMove in currentValuedRounds[currentValuedRoundId].position.availableMoves" class="moves"
                    :class="[(highlightedMove === nextMove.move) ? 'highlighted' : '']"
                    @click="store.dispatch(actionTypes.runMove, { move: nextMove.move })"
                    @mouseover="store.commit(mutationTypes.setHighlightedMove, nextMove.move)"
                    @mouseout="store.commit(mutationTypes.setHighlightedMove, '')">
                <td>{{ nextMove.move }}</td>
                    <td
                        :class="{ win: nextMove.moveValue === 'win', lose: nextMove.moveValue === 'lose', tie: nextMove.moveValue === 'tie', draw: nextMove.moveValue === 'draw' }">
                    {{ nextMove.moveValue }}
                    </td>
                    <td v-if="nextMove.drawLevel >= 0">{{ nextMove.drawLevel }}</td>
                    <td v-else> - </td>
                    <td v-if="nextMove.drawLevel >= 0">{{ nextMove.drawRemoteness }}</td>
                    <td v-else>{{ nextMove.remoteness }}</td>
                    <td v-if="supportsWinBy">{{ nextMove.winby }}</td>
                </tr>
            </template>
        </table>
        <template v-if="isEndOfMatch">
            No moves available.
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { mutationTypes, actionTypes, useStore } from "../../../scripts/plugins/store";
    import { Rounds } from "../../../scripts/gamesmanUni/types";
    import * as Remoteness from "../../../scripts/gamesmanUni/remoteness";

    defineProps({
        toggleOptions: Boolean,
        toggleScrolling: Boolean,
        toggleGuides: Boolean,
    });

    const store = useStore();
    const currentRoundId = computed(() => store.getters.currentRoundId);
    const currentRounds = computed(() => store.getters.currentRounds);
    const isEndOfMatch = computed(() => store.getters.isEndOfMatch);
    const maximumRemoteness = computed(() => store.getters.maximumRemoteness(1, store.getters.currentRoundId));
    
    /** 
    * Iterate through the rounds and see if any visited positions or any child positions of
    * any visited positions have a finite unknown remoteness (FUR). If so, set their remoteness
    * to be a dummy value of 1 greater than the maximum known finite remoteness,
    * which is where on the VVH finite unknown remoteness positions will go.
    * @returns [0]: A copy of the match's rounds, with the remotenesses of FUR positions set to max known remoteness + 1
    * @returns [1]: A boolean indicating whether there are FUR positions.
    */
    const detectFiniteUnknownRemoteness = computed((): [Rounds, boolean] => {
        var roundsCopy = JSON.parse(JSON.stringify(currentRounds.value)) as Rounds;
        var finiteUnknownRemotenessExists = false;
        for (const round of roundsCopy) {
            if (round.position.positionValue !== "unsolved") {
                if (round.position.remoteness == Remoteness.FINITE_UNKNOWN) {
                    round.position.remoteness = maximumRemoteness.value + 1;
                    finiteUnknownRemotenessExists = true;
                }
                for (const move in round.position.availableMoves) {
                    const moveObj = round.position.availableMoves[move]
                    if (moveObj.remoteness == Remoteness.FINITE_UNKNOWN) {
                        moveObj.remoteness = maximumRemoteness.value + 1;
                        finiteUnknownRemotenessExists = true;
                    }
                }
            }
        }
        return [roundsCopy.filter(round => round.position.positionValue !== "unsolved"), finiteUnknownRemotenessExists];
    });
    const currentValuedRounds = computed(() => detectFiniteUnknownRemoteness.value[0]);

    const currentValuedRoundId = computed(() =>
        Math.max(0, currentRoundId.value - currentRounds.value.length + currentValuedRounds.value.length)
    );
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
}
</style>