<template>
    <div id="app-game-vvh-body">
        <p id="color-guides" v-if="showVvhGuides">
            <mark class="uni-win color">win</mark>
            <mark class="uni-draw color">draw</mark>
            <mark class="uni-tie color">tie</mark>
            <mark class="uni-lose color">lose</mark>
        </p>
        <div id="body">
            <div v-for="activeVVHView in activeVVHViews">
                <div v-if="activeVVHView === 'Remoteness'" class="view">
                    <AppGameVvhBodyRemotenessView />
                </div>
                <div v-else-if="activeVVHView === 'Win By'" class="view">
                    <AppGameVvhBodyWinByView />
                </div>
                <div v-else-if="activeVVHView === 'Column'" class="view">
                    <AppGameVvhBodyColumnView />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref } from "vue";
    import { mutationTypes, actionTypes, useStore } from "../../../scripts/plugins/store";
    import { Rounds } from "../../../scripts/gamesmanUni/types";
    import * as Remoteness from "../../../scripts/gamesmanUni/remoteness";
    import { VVHViews } from "../../../models/datas/defaultApp";
    import AppGameVvhBodyRemotenessView from "./AppGameVvhBodyRemotenessView.vue";
    import AppGameVvhBodyWinByView from "./AppGameVvhBodyWinByView.vue";
    import AppGameVvhBodyColumnView from "./AppGameVvhBodyColumnView.vue";

    const store = useStore();
    const options = computed(() => store.getters.options);
    const showVvhGuides = computed(() => (options.value ? options.value.showVvhGuides : true));

    const isPuzzleGame = computed(() => store.getters.currentGameType === "puzzles");
    const currentGameId = computed(() => store.getters.currentGameId); 

    const activeVVHViews = computed(() => store.getters.currentActiveVVHViews);
    
    // Stores true or false, whether the current game supports the Win By view or it does not.
    const supportsWinBy = computed(() =>
        currentGameId.value ? store.getters.supportsWinBy(currentGameId.value) : false
    );

    /** 
     * Changes the Visual Value History's (VVH) view to a new VVH view.
     * @param {string} newVVHView - new VVH view.
     * @returns none.
    */
    const setVVHView = (vvhViewId: number, newVVHView: string) => {
        store.commit(mutationTypes.activateVVHView, {vvhViewId: vvhViewId, vvhView: newVVHView});
    };
</script>

<style lang="scss" scoped>
    #app-game-vvh-body {
        border-radius: 1rem;
        border: 0.1rem solid var(--neutralColor);
        padding: 1rem;

        > #color-guides {
            margin: 1rem;
            text-align: center;
            > .color {
                border-radius: 1rem;
                margin: 1rem;
                padding: 0.25rem 0.5rem;
            }
        }
    }

    .view {
        margin-top: 1 rem;
        margin-bottom: 1 rem;
    }
</style>