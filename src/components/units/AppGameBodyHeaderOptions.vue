<template>
    <div id="app-game-body-header-options">
        <button @click="store.commit(mutationTypes.showOptions, true)">⚙</button>
        <UniPopupWindow v-if="(options && options.showOptions) || false" @close="updateOptions()">
            <div id="popup">
                <h1 id="title">{{ gameName }} ({{ variantDescription }})</h1>
                
                <div id="players">
                    <h3 id="title" v-if="isPuzzleGame">Player</h3>
                    <h3 id="title" v-else>Players</h3>

                    <div id="names" v-if="isPuzzleGame">
                        <div class="name">
                            <h4 class="title" v-if="updatedLeftPlayer.isComputer">Computer</h4>
                            <h4 class="title" v-else>Player</h4>
                            <input class="uni-turn-1 input"
                                aria-label="text"
                                :placeholder="`Current: ${currentLeftPlayerName}`"
                                v-model="updatedLeftPlayer.name" />
                            <p class="label">
                                New: <span class="uni-turn-1">{{ 
                                    updatedLeftPlayer.name ? updatedLeftPlayer.name : currentLeftPlayer.name
                                }}</span>
                            </p>
                        </div>
                    </div>
                    <div id="names" v-else>
                        <div class="name">
                            <h4 class="title">First Player</h4>
                            <input class="uni-turn-1 input"
                                aria-label="text"
                                :placeholder="`Current: ${currentLeftPlayerName}`"
                                v-model="updatedLeftPlayer.name" />
                            <p class="label">
                                New: <span class="uni-turn-1">{{ 
                                    updatedLeftPlayer.name ? updatedLeftPlayer.name : currentLeftPlayer.name
                                }}</span>
                            </p>
                            <input class="uni-toggle-button"
                                aria-label="toggle"
                                type="checkbox"
                                v-model="updatedLeftPlayer.isComputer" />
                            <label for="checkbox">Computer</label>
                        </div>
                        <div class="name">
                            <h4 class="title">Second Player</h4>
                            <input class="uni-turn-2 input"
                                aria-label="text"
                                :placeholder="`Current: ${currentRightPlayerName}`"
                                v-model="updatedRightPlayer.name" />
                            <p class="label">
                                New: <span class="uni-turn-2">{{ 
                                    updatedRightPlayer.name ? updatedRightPlayer.name : currentRightPlayer.name
                                }}</span>
                            </p>
                            <input class="uni-toggle-button"
                                aria-label="toggle"
                                type="checkbox"
                                v-model="updatedRightPlayer.isComputer" />
                            <label for="checkbox">Computer</label>
                        </div>
                    </div>
                </div>

                <div id="computer-move-duration" v-if="computerInLoop">
                    <h3 class="title">Computer Move Duration (milliseconds)</h3>
                    <VueSlider id="slider"
                        v-model="options.computerMoveDuration"
                        :min="0"
                        :max="10000"
                        :interval="100"
                        :tooltip="'active'" />
                    <i>
                        (Note: The actual duration will be either the ideal duration above 
                        or server data load time if there is any server data load action, 
                        whichever is greater.)
                    </i>
                </div>

                <div id="visibility-options">
                    <h3 id="title">Visibility Options</h3>
                    <div id="options">
                        <div class="option">
                            <input class="uni-toggle-button"
                                aria-label="toggle"
                                type="checkbox"
                                v-model="options.showMenu" />
                            <label for="checkbox">Game Menu</label>
                        </div>
                        <div class="option">
                            <input class="uni-toggle-button"
                                aria-label="toggle"
                                type="checkbox"
                                v-model="options.showNextMoves" />
                            <label for="checkbox">Available Move Predictions</label>
                        </div>
                        <div class="option" v-if="options.showNextMoves">
                            <input class="uni-toggle-button"
                                aria-label="toggle"
                                type="checkbox"
                                v-model="options.showNextMoveHints" />
                            <label for="checkbox">Available Moves' Position Value Predictions</label>
                        </div>
                        <div class="option" v-if="options.showNextMoves && options.showNextMoveHints">
                            <input class="uni-toggle-button"
                                aria-label="toggle"
                                type="checkbox"
                                v-model="options.showNextMoveDeltaRemotenesses" />
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

    const currentPlayer = computed(() => store.getters.currentPlayer);
    const currentLeftPlayer = computed(() => store.getters.currentLeftPlayer);
    const currentRightPlayer = computed(() => store.getters.currentRightPlayer);
    const currentLeftPlayerName = computed(() => (currentLeftPlayer ? currentLeftPlayer.value.name : ""));
    const currentRightPlayerName = computed(() => (currentRightPlayer ? currentRightPlayer.value.name : ""));

    const updatedLeftPlayer = ref({ name: "", isComputer: false });
    const updatedRightPlayer = ref({ name: "", isComputer: false });

    const gameType = route.params.type as string;
    const gameId = route.params.gameId as string;
    const variantId = route.params.variantId as string;

    const game = computed(() => store.getters.game(gameType, gameId));
    const gameVariant = computed(() => store.getters.variant(gameType, gameId, variantId));
    const gameName = computed(() => (game.value ? game.value.name : ""));
    const variantDescription = computed(() => {
        if (!game.value || !gameVariant.value) return "";
        return gameVariant.value.description;
    });
    const options = computed(() => (store.getters.options));
    const computerInLoop = computed(() => (currentLeftPlayer.value.isComputer || currentRightPlayer.value.isComputer));
    const updateOptions = () => {
        store.commit(mutationTypes.showOptions, false);
        if (updatedLeftPlayer.value.name) 
            store.commit(mutationTypes.setCurrentLeftPlayerName, updatedLeftPlayer.value.name);
        if (updatedRightPlayer.value.name)
            store.commit(mutationTypes.setCurrentRightPlayerName, updatedRightPlayer.value.name);
        store.commit(mutationTypes.setLeftPlayerIsComputer, updatedLeftPlayer.value.isComputer);
        store.commit(mutationTypes.setRightPlayerIsComputer, updatedRightPlayer.value.isComputer);
        options.value && store.commit(mutationTypes.setOptions, options.value);
        if (currentPlayer.value.isComputer) store.dispatch(actionTypes.runComputerMove);
    };

    watch(
        () => options.value && options.value.showOptions,
        () => {
            updatedLeftPlayer.value = { ...currentLeftPlayer.value };
            updatedRightPlayer.value = { ...currentRightPlayer.value };
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
            > #players {
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
