<template>
    <div id="app-game-body-header-options">
        <button @click="store.commit(mutationTypes.showOptions, true)">⚙</button>
        <UniPopupWindow v-if="(options && options.showOptions) || false" @close="updateOptions()">
            <div id="popup">
                <h2 id="title">{{ gameName }} ({{ variantDescription }})</h2>
                <div id="match-types">
                    <h3 id="title">Match Types</h3>
                    <div id="types" v-if="isPuzzleGame">
                        <div class="type">
                            <input type="radio" aria-label="radio" value="c" v-model="updatedMatchType" />
                            <label>Computer</label>
                        </div>
                        <div class="type">
                            <input type="radio" aria-label="radio" value="p" v-model="updatedMatchType" />
                            <label>Player</label>
                        </div>
                    </div>
                    <div id="types" v-else>
                        <div class="type">
                            <input type="radio" aria-label="radio" value="pvp" v-model="updatedMatchType" />
                            <label>Player vs. Player</label>
                        </div>
                        <div class="type">
                            <input type="radio" aria-label="radio" value="pvc" v-model="updatedMatchType" />
                            <label>Player vs. Computer</label>
                        </div>
                        <div class="type">
                            <input type="radio" aria-label="radio" value="cvp" v-model="updatedMatchType" />
                            <label>Computer vs. Player</label>
                        </div>
                        <div class="type">
                            <input type="radio" aria-label="radio" value="cvc" v-model="updatedMatchType" />
                            <label>Computer vs. Computer</label>
                        </div>
                    </div>
                </div>
                <div id="match-players">
                    <template v-if="isPuzzleGame">
                        <h3 id="title">Player</h3>
                        <div id="players" v-if="updatedMatchType === 'c'">
                            <div class="player">
                                <input type="radio" aria-label="radio" value="c1" v-model="updatedPlayerId" />
                                <label>{{ users["c1"].name }}</label>
                            </div>
                            <div class="player">
                                <input type="radio" aria-label="radio" value="c2" v-model="updatedPlayerId" />
                                <label>{{ users["c2"].name }}</label>
                            </div>
                        </div>
                        <div id="players" v-else>
                            <div class="player">
                                <input type="radio" aria-label="radio" value="p1" v-model="updatedPlayerId" />
                                <label>{{ users["p1"].name }}</label>
                            </div>
                            <div class="player">
                                <input type="radio" aria-label="radio" value="p2" v-model="updatedPlayerId" />
                                <label>{{ users["p2"].name }}</label>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <h3 id="title">Left Players</h3>
                        <div id="players" v-if="updatedMatchType[0] === 'c'">
                            <div class="player">
                                <input type="radio" aria-label="radio" value="c1" v-model="updatedLeftPlayerId" />
                                <label>{{ users["c1"].name }}</label>
                            </div>
                            <div class="player">
                                <input type="radio" aria-label="radio" value="c2" v-model="updatedLeftPlayerId" />
                                <label>{{ users["c2"].name }}</label>
                            </div>
                        </div>
                        <div id="players" v-else>
                            <div class="player">
                                <input type="radio" aria-label="radio" value="p1" v-model="updatedLeftPlayerId" />
                                <label>{{ users["p1"].name }}</label>
                            </div>
                            <div class="player">
                                <input type="radio" aria-label="radio" value="p2" v-model="updatedLeftPlayerId" />
                                <label>{{ users["p2"].name }}</label>
                            </div>
                        </div>
                        <template v-if="updatedLeftPlayerId">
                            <h3 id="title">Right Players</h3>
                            <div id="players" v-if="updatedMatchType[2] === 'c'">
                                <div class="player" v-if="updatedLeftPlayerId !== 'c1'">
                                    <input type="radio" aria-label="radio" value="c1" v-model="updatedRightPlayerId" />
                                    <label>{{ users["c1"].name }}</label>
                                </div>
                                <div class="player" v-if="updatedLeftPlayerId !== 'c2'">
                                    <input type="radio" aria-label="radio" value="c2" v-model="updatedRightPlayerId" />
                                    <label>{{ users["c2"].name }}</label>
                                </div>
                            </div>
                            <div id="players" v-else>
                                <div class="player" v-if="updatedLeftPlayerId !== 'p1'">
                                    <input type="radio" aria-label="radio" value="p1" v-model="updatedRightPlayerId" />
                                    <label>{{ users["p1"].name }}</label>
                                </div>
                                <div class="player" v-if="updatedLeftPlayerId !== 'p2'">
                                    <input type="radio" aria-label="radio" value="p2" v-model="updatedRightPlayerId" />
                                    <label>{{ users["p2"].name }}</label>
                                </div>
                            </div>
                        </template>
                    </template>
                </div>
                <div id="player-names">
                    <h3 id="title">Player Names</h3>
                    <div id="names" v-if="isPuzzleGame">
                        <div class="name" v-if="updatedPlayerId[0] === 'c'">
                            <h4 class="title">Computer Name</h4>
                            <input class="uni-turn-1 input" aria-label="text" :placeholder="`Current: ${users ? users[updatedPlayerId].name : ''}`" v-model="updatedPlayerName" />
                            <p class="label" v-if="updatedPlayerName">
                                New: <span class="uni-turn-1">{{ updatedPlayerName }}</span>
                            </p>
                        </div>
                        <div class="name" v-else>
                            <h4 class="title">Player Name</h4>
                            <input class="uni-turn-1 input" aria-label="text" :placeholder="`Current: ${users ? users[updatedPlayerId].name : ''}`" v-model="updatedPlayerName" />
                            <p class="label" v-if="updatedPlayerName">
                                New: <span class="uni-turn-1">{{ updatedPlayerName }}</span>
                            </p>
                        </div>
                    </div>
                    <div id="names" v-else>
                        <div class="name" v-if="updatedLeftPlayerId">
                            <h4 class="title">Left Player Name</h4>
                            <input class="uni-turn-1 input" aria-label="text" :placeholder="`Current: ${users ? users[updatedLeftPlayerId].name : ''}`" v-model="updatedLeftPlayerName" />
                            <p class="label" v-if="updatedLeftPlayerName">
                                New: <span class="uni-turn-1">{{ updatedLeftPlayerName }}</span>
                            </p>
                        </div>
                        <div class="name" v-if="updatedRightPlayerId">
                            <h4 class="title">Right Player Name</h4>
                            <input class="uni-turn-2 input" aria-label="text" :placeholder="`Current: ${users ? users[updatedRightPlayerId].name : ''}`" v-model="updatedRightPlayerName" />
                            <p class="label" v-if="updatedRightPlayerName">
                                New: <span class="uni-turn-2">{{ updatedRightPlayerName }}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div id="computer-move-duration" v-if="updatedMatchType.includes('c')">
                    <h3 class="title">Computer Move Duration (milliseconds)</h3>
                    <VueSlider id="slider" v-model="options.computerMoveDuration" :min="0" :max="10000" :interval="10" :tooltip="'active'" />
                    <i>(Note: The actual duration will be either the ideal duration above or server data load time if there is any server data load action, whichever is greater.)</i>
                </div>
                <div id="visibility-options">
                    <h3 id="title">Visibility Options</h3>
                    <div id="options">
                        <div class="option">
                            <input class="uni-toggle-button" aria-label="toggle" type="checkbox" v-model="options.showVvh" />
                            <label for="checkbox">Visual Value History</label>
                        </div>
                        <div class="option">
                            <input class="uni-toggle-button" aria-label="toggle" type="checkbox" v-model="options.showNextMoves" />
                            <label for="checkbox">Available Move Predictions</label>
                        </div>
                        <div class="option" v-if="options.showNextMoves">
                            <input class="uni-toggle-button" aria-label="toggle" type="checkbox" v-model="options.showNextMoveHints" />
                            <label for="checkbox">Available Moves' Position Value Predictions</label>
                        </div>
                        <div class="option" v-if="options.showNextMoves && options.showNextMoveHints">
                            <input class="uni-toggle-button" aria-label="toggle" type="checkbox" v-model="options.showNextMoveDeltaRemotenesses" />
                            <label for="checkbox">Available Moves' Delta Remoteness Predictions</label>
                        </div>
                    </div>
                </div>
            </div>
        </UniPopupWindow>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref, watch } from "vue";
    import { useRoute } from "vue-router";
    import { actionTypes, mutationTypes, useStore } from "../../scripts/plugins/store";
    import VueSlider from "vue-slider-component";
    import UniPopupWindow from "../templates/UniPopupWindow.vue";

    const route = useRoute();
    const store = useStore();
    const isPuzzleGame = computed(() => store.getters.currentGameType === "puzzles");

    const currentMatchType = computed(() => store.getters.currentMatchType);
    const updatedMatchType = ref("");

    const users = computed(() => store.getters.users);
    const currentPlayerId = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.id : ""));
    const updatedPlayerId = ref("");
    const currentLeftPlayerId = computed(() => (store.getters.currentLeftPlayer ? store.getters.currentLeftPlayer.id : ""));
    const updatedLeftPlayerId = ref("");
    const currentRightPlayerId = computed(() => (store.getters.currentRightPlayer ? store.getters.currentRightPlayer.id : ""));
    const updatedRightPlayerId = ref("");

    const currentPlayerName = computed(() => (store.getters.users ? store.getters.users[currentPlayerId.value].name : ""));
    const updatedPlayerName = ref("");
    const currentLeftPlayerName = computed(() => (store.getters.users ? store.getters.users[currentLeftPlayerId.value].name : ""));
    const updatedLeftPlayerName = ref("");
    const currentRightPlayerName = computed(() => (store.getters.users ? store.getters.users[currentRightPlayerId.value].name : ""));
    const updatedRightPlayerName = ref("");
    const gameType = route.params.type as string;
    const gameId = route.params.gameId as string;
    const variantId = route.params.variantId as string;
    const gameName = computed(() => (store.getters.game(gameType, gameId) ? store.getters.game(gameType, gameId).name : ""));
    const variantDescription = computed(() => (store.getters.game(gameType, gameId) && store.getters.variant(gameType, gameId, variantId) ? store.getters.variant(gameType, gameId, variantId).description : ""));
    const options = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.options : undefined));
    const updateOptions = () => {
        store.commit(mutationTypes.showOptions, false);

        if (updatedMatchType.value !== currentMatchType.value || updatedPlayerId.value !== currentPlayerId.value || updatedLeftPlayerId.value !== currentLeftPlayerId.value || updatedRightPlayerId.value !== currentRightPlayerId.value) {
            if (isPuzzleGame.value) {
                store.dispatch(actionTypes.updateMatchType, { matchType: updatedMatchType.value, players: [updatedPlayerId.value] });
            } else {
                store.dispatch(actionTypes.updateMatchType, { matchType: updatedMatchType.value, players: [updatedLeftPlayerId.value, updatedRightPlayerId.value] });
            }
        }
        if (updatedPlayerName.value && updatedPlayerName.value !== currentPlayerName.value) store.commit(mutationTypes.setCurrentPlayerName, updatedPlayerName.value);
        if (updatedLeftPlayerName.value && updatedLeftPlayerName.value !== currentLeftPlayerName.value) store.commit(mutationTypes.setCurrentLeftPlayerName, updatedLeftPlayerName.value);
        if (updatedRightPlayerName.value && updatedRightPlayerName.value !== currentRightPlayerName.value) store.commit(mutationTypes.setCurrentRightPlayerName, updatedRightPlayerName.value);
        options.value && store.commit(mutationTypes.setOptions, options.value);
        if (store.getters.currentPlayer.id[0] === "c") store.dispatch(actionTypes.runComputerMove);
    };
    watch(
        () => options.value && options.value.showOptions,
        () => {
            updatedMatchType.value = currentMatchType.value;
            if (isPuzzleGame.value) {
                updatedPlayerId.value = currentPlayerId.value;
            } else {
                updatedLeftPlayerId.value = currentLeftPlayerId.value;
                updatedRightPlayerId.value = currentRightPlayerId.value;
            }
        }
    );
    watch(
        () => updatedMatchType.value,
        () => {
            if (updatedMatchType.value === currentMatchType.value) {
                if (isPuzzleGame.value) {
                    updatedPlayerId.value = currentPlayerId.value;
                } else {
                    updatedLeftPlayerId.value = currentLeftPlayerId.value;
                    updatedRightPlayerId.value = currentRightPlayerId.value;
                }
            } else {
                if (isPuzzleGame.value) {
                    updatedPlayerId.value = currentPlayerId.value[0] === "p" ? "c1" : "p1";
                } else {
                    updatedLeftPlayerId.value = "";
                    updatedRightPlayerId.value = "";
                }
            }
        }
    );
    watch(
        () => updatedLeftPlayerId.value,
        () => (updatedLeftPlayerName.value = updatedLeftPlayerId.value === currentLeftPlayerId.value ? currentLeftPlayerName.value : users.value[updatedLeftPlayerId.value] ? users.value[updatedLeftPlayerId.value].name : "")
    );
    watch(
        () => updatedRightPlayerId.value,
        () => (updatedRightPlayerName.value = updatedRightPlayerId.value === currentRightPlayerId.value ? currentRightPlayerName.value : users.value[updatedRightPlayerId.value] ? users.value[updatedRightPlayerId.value].name : "")
    );
    watch(
        () => updatedPlayerId.value,
        () => (updatedPlayerName.value = updatedPlayerId.value === currentPlayerId.value ? currentPlayerName.value : users.value[updatedPlayerId.value] ? users.value[updatedPlayerId.value].name : "")
    );
</script>

<style lang="scss" scoped>
    #app-game-body-header-options {
        > button {
            border-radius: 100%;
            font-size: 2rem;
            height: max(2.5rem, min(5vh, 5vw));
            margin: 0.5rem 0;
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
            > #computer-move-duration {
                padding: 1rem 10%;
                > #title {
                    margin: 1rem;
                }
            }
            > #match-types {
                padding: 1rem 10%;
                > #title {
                    margin: 1rem;
                }
                > #types {
                    align-content: center;
                    align-items: center;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: center;
                    > .type {
                        border: 0.1rem solid var(--neutralColor);
                        border-radius: 1rem;
                        margin: 1rem;
                        padding: 1rem;
                        align-content: center;
                        align-items: center;
                        display: flex;
                        flex-direction: column;
                        flex-wrap: nowrap;
                        justify-content: center;
                    }
                }
            }
            > #match-players {
                padding: 1rem 10%;
                > #title {
                    margin: 1rem;
                }
                > #players {
                    align-content: center;
                    align-items: center;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: center;
                    > .player {
                        border: 0.1rem solid var(--neutralColor);
                        border-radius: 1rem;
                        margin: 1rem;
                        padding: 1rem;
                        align-content: center;
                        align-items: center;
                        display: flex;
                        flex-direction: column;
                        flex-wrap: nowrap;
                        justify-content: center;
                    }
                }
            }
            > #player-names {
                padding: 1rem 10%;
                > #title {
                    margin: 1rem;
                }
                > #names {
                    align-content: center;
                    align-items: center;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: center;
                    > .name {
                        border: 0.1rem solid var(--neutralColor);
                        border-radius: 1rem;
                        margin: 1rem;
                        padding: 1rem;
                        align-content: center;
                        align-items: center;
                        display: flex;
                        flex-direction: column;
                        flex-wrap: nowrap;
                        justify-content: center;
                        > .title {
                            margin: 1rem;
                        }
                        > .input {
                            border: 0.1rem solid var(--neutralColor);
                            border-radius: 1rem;
                            box-sizing: border-box;
                            &:focus {
                                box-shadow: 0.25rem 0.25rem 0.1rem 0.01rem var(--primaryColor);
                                outline: none;
                            }
                        }
                        > .label {
                            text-align: center;
                        }
                    }
                }
            }
            > #visibility-options {
                padding: 1rem 10%;
                > #title {
                    margin: 1rem;
                }
                > #options {
                    align-content: center;
                    align-items: center;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: center;
                    > .option {
                        border: 0.1rem solid var(--neutralColor);
                        border-radius: 1rem;
                        margin: 1rem;
                        padding: 1rem;
                        align-content: center;
                        align-items: center;
                        display: flex;
                        flex-direction: column;
                        flex-wrap: nowrap;
                        justify-content: center;
                    }
                }
            }
        }
    }
</style>
