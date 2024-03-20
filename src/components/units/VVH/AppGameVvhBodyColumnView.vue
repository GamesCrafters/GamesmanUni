<template>
    <div id="app-game-vvh-body-columnview">
        <table>
            <tr class="table-headers">
                <td>Move</td>
                <td>Value</td>
                <td>Remoteness</td>
                <td>Win By</td>
            </tr>
            <tr v-for="nextMove in currentValuedRounds[currentValuedRoundId].position.availableMoves" class="moves"
                @click="store.dispatch(actionTypes.runMove, { move: nextMove.move })">
                <td>{{ nextMove.move }}</td>
                <td
                    :class="{ win: nextMove.moveValue === 'win', lose: nextMove.moveValue === 'lose', tie: nextMove.moveValue === 'tie', draw: nextMove.moveValue === 'draw' }">
                    {{ nextMove.moveValue }}</td>
                <td>{{ nextMove.remoteness }}</td>
                <td>{{ nextMove.winby }}</td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { actionTypes, useStore } from "../../../scripts/plugins/store";
    import "vue-slider-component/theme/default.css";
    import { Rounds } from "../../../scripts/gamesmanUni/types";
    import * as Remoteness from "../../../scripts/gamesmanUni/remoteness";

    const store = useStore();
    const currentRoundId = computed(() => store.getters.currentRoundId);
    const currentRounds = computed(() => store.getters.currentRounds);

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

    .moves:hover {
        background-color: aliceblue;
        cursor: pointer;
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