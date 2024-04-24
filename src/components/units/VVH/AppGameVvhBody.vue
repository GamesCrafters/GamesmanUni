<template>
    <div id="app-game-vvh-body">
        <p id="color-guides" v-if="showVvhGuides">
            <mark class="uni-win color">win</mark>
            <mark class="uni-draw color">draw</mark>
            <mark class="uni-tie color">tie</mark>
            <mark class="uni-lose color">lose</mark>
        </p>
        <div id="body">
            <div v-for="(activeVVHView, viewId) in activeVVHViews" class="view" :class="{scrollable: activeVVHView.toggleScrolling}">
                <div id="view-body">
                    <div class="view-dropdown">
                        <div class="view-dropdown-selection">
                            <b>{{ activeVVHView.name }} ▼</b>
                        </div>
                        <div class="view-dropdown-options">
                            <div class="view-dropdown-option" v-for="vvhViewOption in VVHViews" :class="{active: vvhViewOption === activeVVHView.name}" :key="vvhViewOption" @click="setVVHView(viewId, vvhViewOption)">
                                <div v-if="(vvhViewOption === 'Win By' && supportsWinBy || vvhViewOption != 'Win By') && vvhViewOption != activeVVHView.name">
                                    <b>{{ vvhViewOption }}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="activeVVHView.name === 'Remoteness'">
                        <AppGameVvhBodyRemotenessView :toggle-options="activeVVHView.toggleOptions" :toggle-scrolling="activeVVHView.toggleScrolling" :toggle-guides="activeVVHView.toggleGuides"/>
                    </div>
                    <div v-else-if="activeVVHView.name === 'Win By'">
                        <AppGameVvhBodyWinByView :toggle-options="activeVVHView.toggleOptions" :toggle-scrolling="activeVVHView.toggleScrolling" :toggle-guides="activeVVHView.toggleGuides"/>
                    </div>
                    <div v-else-if="activeVVHView.name === 'Column'">
                        <AppGameVvhBodyColumnView :toggle-options="activeVVHView.toggleOptions" :toggle-scrolling="activeVVHView.toggleScrolling" :toggle-guides="activeVVHView.toggleGuides"/>
                    </div>
                    <p class="bottom x-axis-label" v-if="activeVVHView.toggleGuides">
                        <b> {{ activeVVHView.name }} </b>
                    </p>
                </div>
                <div id="view-buttons">
                    <button class="buttons" v-if="viewId != 0" @click="store.commit(mutationTypes.inactivateVVHView, viewId)" title="Close View">x</button>
                    <button class="buttons" @click="activeVVHView.toggleOptions = !activeVVHView.toggleOptions" title="Toggle View Options">⚙</button>
                    <button class="buttons" @click="activeVVHView.toggleGuides = !activeVVHView.toggleGuides" title="Toggle View Guides">^</button>
                    <button class="buttons" @click="activeVVHView.toggleScrolling = !activeVVHView.toggleScrolling" title="Toggle View Scrolling">↕</button>
                </div>
            </div>
            <button class="buttons" v-if="(supportsWinBy && activeVVHViews.length < VVHViews.length) || (!supportsWinBy && activeVVHViews.length < VVHViews.length - 1)" @click="addVVHView()" title="Add View">+</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { mutationTypes, useStore } from "../../../scripts/plugins/store";
    import AppGameVvhBodyRemotenessView from "./AppGameVvhBodyRemotenessView.vue";
    import AppGameVvhBodyWinByView from "./AppGameVvhBodyWinByView.vue";
    import AppGameVvhBodyColumnView from "./AppGameVvhBodyColumnView.vue";
    import { VVHViews } from "../../../models/datas/defaultApp";

    const store = useStore();
    const options = computed(() => store.getters.options);
    const showVvhGuides = computed(() => (options.value ? options.value.showVvhGuides : true));
    const currentGameId = computed(() => store.getters.currentGameId);

    const activeVVHViews = computed(() => store.getters.currentActiveVVHViews);

    const showVvhMeters = computed(() => (options.value ? options.value.showVvhMeters : false));
    const vvhScrolling = computed(() => (options.value ? options.value.vvhScrolling : false));

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
     * Adds an additional view to the VVH Body; loops through all of the VVHViews and until it finds 
     * a view which is not active.
     * @returns none.
     */
    const addVVHView = () => {
        if (supportsWinBy.value) {
            for(let vvhViewId = 0; vvhViewId < VVHViews.length; vvhViewId++) {
                if(!activeVVHViews.value.some(VVHView => VVHView.name === VVHViews[vvhViewId])) {
                    store.commit(mutationTypes.activateVVHView, {vvhViewId: activeVVHViews.value.length, vvhView: VVHViews[vvhViewId]});
                    break;
                }
            }
        } else {
            for(let vvhViewId = 0; vvhViewId < VVHViews.length; vvhViewId++) {
                if( VVHViews[vvhViewId] != "Win By" && !activeVVHViews.value.some(VVHView => VVHView.name === VVHViews[vvhViewId])) {
                    store.commit(mutationTypes.activateVVHView, {vvhViewId: activeVVHViews.value.length, vvhView: VVHViews[vvhViewId]});
                    break;
                }
            }
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

    .buttons {
        margin: 0.5rem 0.5rem 0.5rem 0.5rem;
        border-radius: 100%;
        height: max(1.5rem, min(2.5vh, 2.5vw));
        width: max(1.5rem, min(2.5vh, 2.5vw));
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