<template>
    <div id="app-game-body-header-options">
        <button @click="store.commit(mutationTypes.showOptions, true)">⚙</button>
        <UniPopupWindow v-if="(options && options.showOptions) || false" @close="updateOptions()">
            <div id="popup">
                <h2 id="title">{{ gameName }} ({{ variantDescription }})</h2>
                <div id="visibility-options">
                    <h3 id="title">Visibility Options</h3>
                    <div id="options">
                        <div class="option">
                            <input class="uni-toggle-button" aria-label="toggle" type="checkbox" v-model="options.showVisualValueHistory" />
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
    import { computed } from "vue";
    import { useRoute } from "vue-router";
    import { mutationTypes, useStore } from "../../scripts/plugins/store";
    import UniPopupWindow from "../templates/UniPopupWindow.vue";

    const route = useRoute();
    const store = useStore();
    const gameType = route.params.type as string;
    const gameId = route.params.gameId as string;
    const variantId = route.params.variantId as string;
    const gameName = computed(() => (store.getters.game(gameType, gameId) ? store.getters.game(gameType, gameId).name : ""));
    const variantDescription = computed(() => (store.getters.game(gameType, gameId) && store.getters.variant(gameType, gameId, variantId) ? store.getters.variant(gameType, gameId, variantId).description : ""));
    const options = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.options : undefined));
    const updateOptions = (): void => {
        store.commit(mutationTypes.showOptions, false);
        options.value && store.commit(mutationTypes.setOptions, options.value);
    };
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
