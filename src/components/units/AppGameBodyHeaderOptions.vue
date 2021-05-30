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
                            <input type="radio" aria-label="radio" :value="'pvc' || 'cvp'" v-model="updatedMatchType" />
                            <label>Player vs. Computer</label>
                        </div>
                        <div class="type">
                            <input type="radio" aria-label="radio" value="cvc" v-model="updatedMatchType" />
                            <label>Computer vs. Computer</label>
                        </div>
                    </div>
                </div>
                <div id="computer-move-duration" v-if="updatedMatchType.includes('c')">
                    <h3 class="title">Computer Move Duration (milliseconds)</h3>
                    <VueSlider id="slider" v-model="options.computerMoveDuration" :min="0" :max="10000" interval="10" :tooltip="'active'" />
                    <i>(Note: The actual duration will be either the ideal duration above or server data load time if there is any server data load action, whichever is greater.)</i>
                </div>
                <div id="player-names">
                    <h3 id="title">Player Names</h3>
                    <div id="names">
                        <div class="name">
                            <h4 class="title" v-if="isPuzzleGame">Player Name</h4>
                            <h4 class="title" v-else>Left Player Name</h4>
                            <input class="uni-turn-1 input" aria-label="text" :placeholder="`Current: ${currentLeftPlayerName}`" v-model="updatedLeftPlayerName" />
                            <p class="label" v-if="updatedLeftPlayerName">
                                New: <span class="uni-turn-1">{{ updatedLeftPlayerName }}</span>
                            </p>
                        </div>
                        <div class="name" v-if="!isPuzzleGame">
                            <h4 class="title">Right Player Name</h4>
                            <input class="uni-turn-2 input" aria-label="text" :placeholder="`Current: ${currentRightPlayerName}`" v-model="updatedRightPlayerName" />
                            <p class="label" v-if="updatedRightPlayerName">
                                New: <span class="uni-turn-2">{{ updatedRightPlayerName }}</span>
                            </p>
                        </div>
                    </div>
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
                            <label for="checkbox">Next Moves</label>
                        </div>
                        <div class="option" v-if="options.showNextMoves">
                            <input class="uni-toggle-button" aria-label="toggle" type="checkbox" v-model="options.showNextMoveHints" />
                            <label for="checkbox">Next Move Position Values</label>
                        </div>
                        <div class="option" v-if="options.showNextMoves && options.showNextMoveHints">
                            <input class="uni-toggle-button" aria-label="toggle" type="checkbox" v-model="options.showNextMoveDeltaRemotenesses" />
                            <label for="checkbox">Next Move Delta Remotenesses</label>
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
    const currentGameType = computed(() => store.getters.currentGameType);
    const currentMatchType = computed(() => store.getters.currentMatchType);
    const updatedMatchType = ref("");
    const currentLeftPlayerName = computed(() => (store.getters.currentLeftPlayer ? store.getters.currentLeftPlayer.name : ""));
    const currentRightPlayerName = computed(() => (store.getters.currentRightPlayer ? store.getters.currentRightPlayer.name : ""));
    const updatedLeftPlayerName = ref("");
    const updatedRightPlayerName = ref("");
    const gameType = route.params.type as string;
    const gameId = route.params.gameId as string;
    const variantId = route.params.variantId as string;
    const gameName = computed(() => (store.getters.game(gameType, gameId) ? store.getters.game(gameType, gameId).name : ""));
    const variantDescription = computed(() => (store.getters.game(gameType, gameId) && store.getters.variant(gameType, gameId, variantId) ? store.getters.variant(gameType, gameId, variantId).description : ""));
    const options = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.options : undefined));
    const updateOptions = () => {
        store.commit(mutationTypes.showOptions, false);
        store.commit(mutationTypes.setCurrentLeftPlayerName, updatedLeftPlayerName.value ? updatedLeftPlayerName.value : currentLeftPlayerName.value);
        if (!isPuzzleGame.value) store.commit(mutationTypes.setCurrentRightPlayerName, updatedRightPlayerName.value ? updatedRightPlayerName.value : currentRightPlayerName.value);
        if (!(currentGameType.value === "puzzles" || updatedMatchType.value === "pvp" || updatedMatchType.value === "cvc")) updatedMatchType.value = "";
        if (updatedMatchType.value !== currentMatchType.value) store.dispatch(actionTypes.restartMatch, { matchType: updatedMatchType.value });
        options.value && store.commit(mutationTypes.setOptions, options.value);
    };
    watch(
        () => options.value && options.value.showOptions,
        () => {
            updatedMatchType.value = currentMatchType.value;
        }
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
