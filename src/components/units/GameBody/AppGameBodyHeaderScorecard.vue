<template>
    <div id="app-game-body-header-scorecard">
        <button @click="store.commit(mutationTypes.showScorecard, true)" :disabled="currentGameType === 'puzzles' || currentScorecardSize === 0" title="Display Scorecard">📖</button>
        <UniPopupWindow v-if="options && options.showScorecard" @close="store.commit(mutationTypes.showScorecard, false)">
            <div id="popup">
                <h1 id="title">Scorecard</h1>
                <div id="donut">
                    <AppGameBodyHeaderScorecardDonut player-side="left" :selected-id="selectedId" />
                    <AppGameBodyHeaderScorecardRatingHistory :selected-id="selectedId"/>
                    <AppGameBodyHeaderScorecardDonut player-side="right" :selected-id="selectedId" />
                </div>
                <AppGameBodyHeaderScorecardTable @row-clicked="handleRowClicked" />
            </div>
        </UniPopupWindow>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref } from "vue";
    import { mutationTypes, useStore } from "../../../scripts/plugins/store";
    import UniPopupWindow from "../../templates/UniPopupWindow.vue";
    import AppGameBodyHeaderScorecardDonut from "./AppGameBodyHeaderScorecardDonut.vue";
    import AppGameBodyHeaderScorecardTable from "./AppGameBodyHeaderScorecardTable.vue";
    import AppGameBodyHeaderScorecardRatingHistory from "./AppGameBodyHeaderScorecardRatingHistory.vue";
    
    const store = useStore();
    const selectedId = ref(-1);
    const options = computed(() => store.getters.options);
    const currentGameType = computed(() => store.getters.currentGameType);
    const currentScorecardSize = computed(() => store.getters.currentScorecard.records.length);

    const handleRowClicked = (id: number) => {
        selectedId.value = id;
    }
</script>

<style lang="scss" scoped>
    #app-game-body-header-scorecard {
        button {
            border-radius: 100%;
            font-size: 2rem;
            height: max(2.5rem, min(5vh, 5vw));
            width: max(2.5rem, min(5vh, 5vw));
        }

        #popup {
            align-content: center;
            align-items: stretch;
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: center;
            min-height: 100%;
            > #title {
                margin: 1rem;
            }
        }

        #donut {
            display: flex;
            flex-direction: row;  
            justify-content: space-between; 
            align-items: center;
            padding: 20px;
            }  
    }
</style>