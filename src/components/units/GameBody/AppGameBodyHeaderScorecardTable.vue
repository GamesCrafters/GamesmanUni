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
                <tr v-for="record in currentScorecard.records" class="records">
                    <td> {{ record.gameName }} </td>
                    <td>
                        <div> {{ record.variantName }} </div>
                    </td>
                    <td>
                        <span v-if="record.leftPlayerEndPosition === 'win'">👑</span>
                         {{ record.leftPlayer.name }}
                         <span v-if="record.leftPlayer.isComputer">🤖</span>
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
                        <span v-if="record.leftPlayerEndPosition === 'lose'">👑</span>
                         {{ record.rightPlayer.name }} 
                         <span v-if="record.rightPlayer.isComputer">🤖</span>
                    </td>
                    <td>
                        <div v-if="record.rightPlayer.isComputer"> {{ record.CPUsStrategies[1] }} </div>
                        <div v-else> - </div>
                    </td>
                    <td>
                        <div v-if="record.rightPlayer.isComputer && record.CPUsStrategies[1] === 'Skill Expression'"> {{ record.CPUsRatings[1] }} </div>
                        <div v-else> - </div>
                    </td>
                    <td> {{ record.moveHistory }} </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../../scripts/plugins/store";
    const store = useStore();

    const currentScorecard = computed(() => store.getters.currentScorecard);
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
            }
        }
    }
</style>
