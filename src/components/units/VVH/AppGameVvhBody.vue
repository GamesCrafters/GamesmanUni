<template>
    <div id="app-game-vvh-body">
        <div id="body">
            <div v-for="(activeVVHView, viewId) in activeVVHViews" class="view" :class="{scrollable: activeVVHView.viewOptions.toggleScrolling}">
                <div id="view-body">
                    <div class="view-dropdown">
                        <div class="view-dropdown-selection">
                            <b>{{ activeVVHView.name }} ▼</b>
                        </div>
                        <div class="view-dropdown-options">
                            <div class="view-dropdown-option" v-for="vvhViewOption in VVHViews" :class="{active: vvhViewOption === activeVVHView.name}" :key="vvhViewOption" @click="setVVHView(viewId, vvhViewOption)">
                                <div v-if="renderDropdownOption(vvhViewOption, activeVVHView.name)">
                                    <b>{{ vvhViewOption }}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="activeVVHView.name === 'Remoteness'">
                        <AppGameVvhBodyRemotenessView :toggle-options="activeVVHView.viewOptions.toggleOptions" :toggle-scrolling="activeVVHView.viewOptions.toggleScrolling" :toggle-guides="activeVVHView.viewOptions.toggleGuides" :toggle-side-branch-exploration="activeVVHView.viewOptions.toggleSideBranchExploration"/>
                    </div>
                    <div v-else-if="activeVVHView.name === 'Win By'">
                        <AppGameVvhBodyWinByView :toggle-options="activeVVHView.viewOptions.toggleOptions" :toggle-scrolling="activeVVHView.viewOptions.toggleScrolling" :toggle-guides="activeVVHView.viewOptions.toggleGuides" :toggle-side-branch-exploration="activeVVHView.viewOptions.toggleSideBranchExploration"/>
                    </div>
                    <div v-else-if="activeVVHView.name === 'Draw Level'">
                        <AppGameVvhBodyDrawLevelView :toggle-options="activeVVHView.viewOptions.toggleOptions" :toggle-scrolling="activeVVHView.viewOptions.toggleScrolling" :toggle-guides="activeVVHView.viewOptions.toggleGuides"/>
                    </div>
                    <div v-else-if="activeVVHView.name === 'Column'">
                        <AppGameVvhBodyColumnView :toggle-options="activeVVHView.viewOptions.toggleOptions" :toggle-scrolling="activeVVHView.viewOptions.toggleScrolling" :toggle-guides="activeVVHView.viewOptions.toggleGuides"/>
                    </div>
                    <div v-else-if="activeVVHView.name === 'Tree View'">
                        <AppGameVvhBodyTreeView :toggle-options="activeVVHView.viewOptions.toggleOptions" :toggle-scrolling="activeVVHView.viewOptions.toggleScrolling" :toggle-guides="activeVVHView.viewOptions.toggleGuides"/>
                    </div>
                    <p class="bottom x-axis-label" v-if="activeVVHView.viewOptions.toggleGuides">
                        <b> {{ activeVVHView.name }} </b>
                    </p>
                </div>
                <div id="view-buttons">
                    <button class="buttons" v-if="viewId != 0" @click="store.commit(mutationTypes.inactivateVVHView, viewId)" title="Close View">x</button>
                    <button class="buttons" @click="activeVVHView.viewOptions.toggleOptions = !activeVVHView.viewOptions.toggleOptions" title="Toggle View Options">⚙</button>
                    <button class="buttons" @click="activeVVHView.viewOptions.toggleGuides = !activeVVHView.viewOptions.toggleGuides" title="Toggle View Guides">^</button>
                    <button class="buttons" @click="activeVVHView.viewOptions.toggleScrolling = !activeVVHView.viewOptions.toggleScrolling" title="Toggle View Scrolling">↕</button>
                    <button class="buttons" v-if="activeVVHView.name === 'Remoteness' || activeVVHView.name === 'Win By'" @click="activeVVHView.viewOptions.toggleSideBranchExploration = !activeVVHView.viewOptions.toggleSideBranchExploration" title="Toggle Side Branch Exploration">⧖</button>
                </div>
            </div>
            <button id="add-view-button" class="buttons" v-if="existsAvailableView" @click="addVVHView()" title="Add View">+</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { mutationTypes, useStore } from "../../../scripts/plugins/store";
    import AppGameVvhBodyRemotenessView from "./AppGameVvhBodyRemotenessView.vue";
    import AppGameVvhBodyWinByView from "./AppGameVvhBodyWinByView.vue";
    import AppGameVvhBodyColumnView from "./AppGameVvhBodyColumnView.vue";
    import AppGameVvhBodyDrawLevelView from "./AppGameVvhBodyDrawLevelView.vue";
    import AppGameVvhBodyTreeView from "./AppGameVvhBodyTreeView.vue";
    import { VVHViews } from "../../../models/datas/defaultApp";
    
    const store = useStore();
    const currentGameId = computed(() => store.getters.currentGameId);

    const activeVVHViews = computed(() => store.getters.currentActiveVVHViews);

    const isPuzzleGame = computed(() => store.getters.currentGameType === "puzzles");

    // Stores true or false, whether the current game supports the Win By view or it does not.
    const supportsWinBy = computed(() =>
        currentGameId.value ? store.getters.supportsWinBy(currentGameId.value) : false
    );
    
    /** 
     * Changes the visual value history view with vvhViewId to a new vvhView. If the new vvh view is
     * already in the activeVVHViews array, then swaps the new vvh view with the view with vvhViewId.
     * @param {number} vvhViewId - Index of current view in activeVVHViews array.
     * @param {string} newVVHView - new VVH view.
     * @returns none.
    */
    const setVVHView = (vvhViewId: number, newVVHView: string) => {
        for (let activeVVHViewId = 0; activeVVHViewId < activeVVHViews.value.length; activeVVHViewId++) {
            if (activeVVHViews.value[activeVVHViewId].name === newVVHView) {
                const vvhViewNameSwap = activeVVHViews.value[vvhViewId].name;
                store.commit(mutationTypes.activateVVHView, {vvhViewId: activeVVHViewId, vvhView: vvhViewNameSwap});
                break;
            }
        }
        store.commit(mutationTypes.activateVVHView, {vvhViewId: vvhViewId, vvhView: newVVHView});
    }

    /**
     * Adds an additional view to the VVH Body; filters all of the VVHViews until it finds 
     * a view which is not active.
     * @returns none.
     */
    const addVVHView = () => {
        for(let vvhViewId = 0; vvhViewId < VVHViews.length; vvhViewId++) {
            if (viewIsAvailable(VVHViews[vvhViewId])) {
                store.commit(mutationTypes.activateVVHView, {vvhViewId: activeVVHViews.value.length, vvhView: VVHViews[vvhViewId]});
                break;
            }
        }
    }

    /**
     * Returns true if there exists at least one view which is available.
     * @returns none.
     */
    const existsAvailableView = computed(() => {
        for(let vvhViewId = 0; vvhViewId < VVHViews.length; vvhViewId++) {
            if (viewIsAvailable(VVHViews[vvhViewId])) {
                return true;
            }
        }
        return false;
    });

    /**
     * Determines if the VVH View Option VVHView is legal. Checks if the current
     * view is not active and the game meets some pre-established conditions.
     * @param VVHView 
     * @returns true/false if the vvhViewOption is rendered depending on the pre-established conditions.
     */
     const viewIsAvailable = (VVHVIewName: string) => {
        if (activeVVHViews.value.some((activeVVHView) => activeVVHView.name === VVHVIewName)) {
            return false;
        }

        return viewIsLegal(VVHVIewName);
    }

    /**
     * Determines if the VVH View Option vvhViewOption renders depending on if the VVH View Option is legal 
     * and is not the current active VVH View.
     * @param vvhViewOption 
     * @param activeVVHViewName 
     * @returns true/false if the vvhViewOption is rendered depending on the pre-established conditions.
     */
    const renderDropdownOption = (vvhViewOptionName: string, activeVVHViewName: string) => {
        if (vvhViewOptionName == activeVVHViewName) {
            return false;
        }
        
        return viewIsLegal(vvhViewOptionName);
    }
    
    const viewIsLegal = (VVHViewName: string) => {
        switch(VVHViewName) {
            case "Win By":
                return supportsWinBy.value;
            case "Draw Level":
                return !isPuzzleGame.value;
            case "Tree View":
                return !isPuzzleGame.value;
            default:
                return true;
        }
    }
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
        margin: 0 0 1rem 1rem;
        border-radius: 1rem;
        border: 0.1rem solid var(--neutralColor);
        padding: 1rem;
        display: flex;
        >#view-body {
            flex: 100;
            >.x-axis-label {
                text-align: center;
            }
        }
    }

    .view-dropdown {
        min-width: 192px;
        position: static;
        top: 0;
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

    #add-view-button {
        margin: auto;
    }
    
    .buttons {
        margin: 0.5rem;
        border-radius: 100%;
        height: max(1.5rem, min(2.5vh, 2.5vw));
        width: max(1.5rem, min(2.5vh, 2.5vw));
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 1rem;
        line-height: 1;
    }

    #view-buttons {
        float: right;
        display: flex;
        flex-direction: column;
        position: sticky;
        top: 0;
    }

    .scrollable {
        max-height: 40em;
        overflow-y:auto;
    }
</style>