<template>
    <div id="app-game-vvh-body">
        <p id="color-guides" v-if="showVvhGuides">
            <mark class="uni-win color">win</mark>
            <mark class="uni-draw color">draw</mark>
            <mark class="uni-tie color">tie</mark>
            <mark class="uni-lose color">lose</mark>
        </p>
        <div class="top x-axis-label" v-if="showVvhGuides">
            <div class="view-dropdown" v-if="supportsWinBy">
                <div class="view-dropdown-selection">
                    <b>{{ vvhView }} ▼</b>
                </div>
                <div class="view-dropdown-options">
                    <div class="view-dropdown-option" :class="{active: vvhViewOption === vvhView}" v-for="vvhViewOption in VVHViews" :key="vvhViewOption" @click="setVvhView(vvhViewOption)">
                        <div v-if="vvhViewOption != vvhView">
                            <b>{{ vvhViewOption }}</b>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <b>Remoteness</b>
            </div>
        </div>
        <div id="body">
            <!-- Chart -->
            <div v-if="vvhView === 'Remoteness'">
                <AppGameVvhBodyRemotenessView />
            </div>
            <div v-else-if="vvhView === 'Win By'">
                <AppGameVvhBodyWinByView />
            </div>
            <div v-else-if="vvhView === 'Column'">
                <AppGameVvhBodyColumnView />
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

    // Default VVH View.
    const vvhView = ref(store.state.app.vvhView);
    
    // Stores true or false, whether the current game supports the Win By view or it does not.
    const supportsWinBy = computed(() =>
        currentGameId.value ? store.getters.supportsWinBy(currentGameId.value) : false
    );

    /** 
     * Changes the Visual Value History's (VVH) view to a new VVH view.
     * @param {string} newVvhView - new VVH view.
     * @returns none.
    */
    const setVvhView = (newVvhView: string) => {
        vvhView.value = newVvhView;
        store.commit(mutationTypes.setVvhView, newVvhView);
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

    .view-dropdown {
        min-width: 192px;
        position: relative;
        display: inline-block;
        cursor: pointer;
    }

    .view-dropdown-options {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 192px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        padding: 6px 0px 6px 0px;
        z-index: 1;
    }

    .view-dropdown:hover .view-dropdown-options {
        display: block;
    }
</style>