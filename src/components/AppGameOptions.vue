<template>
    <button @click="store.commit(mutationTypes.showOptions, true)">⚙️</button>
    <AppPopupWindow v-if="game.options.showOptions" @close="updateOptions()">
        <h2>
            {{ game.name }}
            <br />
            ({{ game.variant.description }})
        </h2>
        <h3>Game Options</h3>
        <div id="app-game-option-show-hide-container">
            <h4>Show/Hide...</h4>
            <div class="app-game-option">
                <input type="checkbox" v-model="options.showDateTime" />
                <label for="checkbox">Date and Time</label>
            </div>
            <div class="app-game-option">
                <input type="checkbox" v-model="options.showVisualValueHistory" />
                <label for="checkbox">Visual Value History</label>
            </div>
            <div class="app-game-option">
                <input type="checkbox" v-model="options.showNextMoves" />
                <label for="checkbox">Next Moves</label>
            </div>
            <div class="app-game-option">
                <input type="checkbox" v-model="options.showNextMoveHints" />
                <label for="checkbox">Hint</label>
            </div>
            <div class="app-game-option">
                <input type="checkbox" v-model="options.showNextMoveDeltaRemotenesses" />
                <label for="checkbox">Delta Remoteness</label>
            </div>
        </div>
    </AppPopupWindow>
</template>

<script lang="ts" setup>
    import { ref } from "vue";
    import { mutationTypes, useStore } from "../plugins/store";
    import AppPopupWindow from "./AppPopupWindow.vue";

    const store = useStore();
    const game = ref(store.state.app.game);

    const options = game.value.options;

    const updateOptions = (): void => {
        store.commit(mutationTypes.showOptions, false);
        store.commit(mutationTypes.setOptions, options);
        game.value = store.state.app.game;
    };
</script>

<style scoped lang="scss">
    #app-game-option-show-hide-container {
        align-content: center;
        align-items: flex-start;
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        display: flex;
        flex-direction: column;
        margin-left: auto;
        margin-right: auto;
        padding: 0.25em;
        width: 15em;
        .app-game-option {
            input {
                margin-right: 1em;
            }
        }
    }
</style>
