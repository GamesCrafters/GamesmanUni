<template>
    <div id="app-game-body-header-scorecard-table">
        <div id="table">
            <table>
                <tr class="table-headers">
                    <td>Game</td>
                    <td>Variant</td>
                    <td>Left Player</td>
                    <td>Strategy</td>
                    <td>Rating</td>
                    <td>Right Player</td>
                    <td>Strategy</td>
                    <td>Rating</td>
                    <td>Move History</td>
                </tr>
                <tr v-for="(record, index) in currentScorecard.records" class="records" :key="index" @click="rowClicked(index)" >
                    <td> {{ record.gameName }} </td>
                    <td>
                        <div> {{ record.variantName }} </div>
                    </td>
                    <td>
                        <div v-if="record.leftPlayerEndPosition === 'win'">👑</div>
                        <span v-if="record.leftPlayer.isComputer">🤖</span>
                         {{ record.leftPlayer.name }}
                         
                    </td>
                    <td>
                        <div v-if="record.leftPlayer.isComputer"> {{ record.CPUsStrategies[0] }} </div>
                        <div v-else> - </div>
                    </td>
                    <td>
                        <div v-if="record.leftPlayer.isComputer && record.CPUsStrategies[0] === 'Skill Expression'"> {{ record.CPUsRatings[0] }} </div>
                        <div v-else> - </div>
                    </td>
                    <td>
                        <div v-if="record.leftPlayerEndPosition === 'lose'">👑</div>
                        <span v-if="record.rightPlayer.isComputer">🤖</span>
                         {{ record.rightPlayer.name }} 
                    </td>
                    <td>
                        <div v-if="record.rightPlayer.isComputer"> {{ record.CPUsStrategies[1] }} </div>
                        <div v-else> - </div>
                    </td>
                    <td>
                        <div v-if="record.rightPlayer.isComputer && record.CPUsStrategies[1] === 'Skill Expression'"> {{ record.CPUsRatings[1] }} </div>
                        <div v-else> - </div>
                    </td>
                    <td> 
                        <span>
                            <button @click="copyToClipboard(record.moveHistory)">{{ record.moveHistory }} </button>
                        </span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, defineEmits } from "vue";
    import { useStore } from "../../../scripts/plugins/store";
    const store = useStore();

    const currentScorecard = computed(() => store.getters.currentScorecard);

    const copyToClipboard = (moveHistory: string) => {
        navigator.clipboard.writeText(moveHistory);
    }
    
    const emit = defineEmits(['row-clicked']);
    const rowClicked = (index: number) => {
        emit('row-clicked', index);
    };

</script>

<style lang="scss" scoped>
    #app-game-body-header-scorecard-table {
        #table {
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
            .records:hover {
                background-color: aliceblue;
                cursor: pointer;
            }
            button {
                padding: 0.2rem;
            }
        }
    }
</style>
