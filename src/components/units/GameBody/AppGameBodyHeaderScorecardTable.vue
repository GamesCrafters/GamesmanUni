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
                <tr v-for="scorecard in currentScorecard" class="records">
                    <td> {{ scorecard.gameName }} </td>
                    <td>
                        <div> {{ scorecard.variantName }} </div>
                    </td>
                    <td>
                        <div v-if="scorecard.leftPlayerWon">👑</div>
                         {{ scorecard.leftPlayer.name }}
                    </td>
                    <td>
                        <div v-if="scorecard.leftPlayer.isComputer"> {{ scorecard.CPUsStrategies[0] }} </div>
                        <div v-else> - </div>
                    </td>
                    <td>
                        <div v-if="scorecard.leftPlayer.isComputer"> {{ scorecard.CPUsRatings[0] }} </div>
                        <div v-else> - </div>
                    </td>
                    <td>
                        <div v-if="!scorecard.leftPlayerWon">👑</div>
                         {{ scorecard.rightPlayer.name }} 
                    </td>
                    <td>
                        <div v-if="scorecard.rightPlayer.isComputer"> {{ scorecard.CPUsStrategies[1] }} </div>
                        <div v-else> - </div>
                    </td>
                    <td>
                        <div v-if="scorecard.rightPlayer.isComputer"> {{ scorecard.CPUsRatings[1] }} </div>
                        <div v-else> - </div>
                    </td>
                    <td> {{ scorecard.moveHistory }} </td>
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
