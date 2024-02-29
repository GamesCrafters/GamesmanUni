<template>
    <div id="app-game-body-header-scorecard-table">
        <div id="table">
            <table>
                <tr>
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
                        <div v-if="record.leftPlayerWon">👑</div>
                         {{ record.leftPlayer.name }}
                    </td>
                    <td>
                        <div v-if="record.leftPlayer.isComputer"> {{ record.CPUsStrategies[0] }} </div>
                        <div v-else> - </div>
                    </td>
                    <td>
                        <div v-if="record.leftPlayer.isComputer"> {{ record.CPUsRatings[0] }} </div>
                        <div v-else> - </div>
                    </td>
                    <td>
                        <div v-if="!record.leftPlayerWon">👑</div>
                         {{ record.rightPlayer.name }} 
                    </td>
                    <td>
                        <div v-if="record.rightPlayer.isComputer"> {{ record.CPUsStrategies[1] }} </div>
                        <div v-else> - </div>
                    </td>
                    <td>
                        <div v-if="record.rightPlayer.isComputer"> {{ record.CPUsRatings[1] }} </div>
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

            .records:hover {
                background-color: aliceblue;
            }
        }
    }
</style>
