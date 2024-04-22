<template>
    <div id="app-game-body-header-scorecard-rating-history">
        <div id="ratings">
            <div id="ratings-table">
                <table>
                    <thead>
                        <tr class="ratings-headers">
                            <td>P1</td>
                            <td>P2</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(move, index) in moveHistory.slice(0, -1)" :key="index" class="ratings-row">
                            <td
                                v-if="index % 2 === 0"
                                :style="{ backgroundColor: getColor(moveRatings[index])}">
                                {{ move }}
                            </td>
                            <td v-else style="background-color: lightgrey;"></td>

                            <td
                                v-if="index %2 !== 0"
                                :style="{ backgroundColor: getColor(moveRatings[index])}">
                                {{ move }}
                            </td>
                            <td v-else style="background-color: lightgrey;"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, watch, ref, onMounted } from "vue";
    import { mutationTypes, useStore } from "../../../scripts/plugins/store";
    import { Rating } from "../../../scripts/gamesmanUni/types";
    const props = defineProps({
        selectedId: {
            type: Number,
            required: true
        }
    });
    const store = useStore();
    const currentScorecard = computed(() => store.getters.currentScorecard);
    const currentScorecardRecord = computed(() => {
        const records = currentScorecard.value.records;
        return records.length > 0 ? records.at(props.selectedId) : null;
    });
    const moveHistory = computed(() => {
        const record = currentScorecardRecord.value;
        if (!record) return [];
        return record.stringMoveHistory;
    });
    const moveRatings = computed(() => {
        const record = currentScorecardRecord.value;
        if (!record) return [];
        return record.moveHistoryRatings;
    })

    const getColor = (rating:number) => {
        if (rating === 0) return "#CD5C5C";
        else if (rating === 1) return "#8FBC8F";
        else if (rating === 2) return "#40E0D0";
        return "#40E0D0";
    }

    
</script>

<style lang="scss" scoped>
    #ratings-table {
        overflow-y: auto; // Keeps vertical scrolling
        max-height: 400px; // Adjust as needed for 10 rows
        width: 100%; // Ensure the ratings div takes full width

        table {
            width: 100%; // Ensures the table takes the full width of #ratings
            tr {
                display: flex;
            }
            td {
                flex: 1; // Distributes space evenly among cells
                min-width: 150px; // Ensures each column has a minimum width, adjust as needed
                text-align: center; // Centers text within cells
                padding: 10px; // Adds padding for better readability
            }
            td:empty { // Targets empty td elements
                background-color: #f0f0f0; // Light grey background for empty cells
            }
        }
    }
    
</style>

