<template>
    <div>
        <h3>Position</h3>
        <pre id="app-game-board-default-position-value">{{ position }}</pre>
    </div>
    <div v-if="store.state.app.game.options.showNextMoves">
        <hr class="c-divider" />
        <h3>Move(s)</h3>
        <div id="app-game-board-default-moves-buttons">
            <button v-for="availableMove in store.state.app.game.round.availableMoves" :key="availableMove.move" :class="store.state.app.game.options.showNextMoveHints ? `c-${availableMove.moveValue}` : ''" :style="{ opacity: store.state.app.game.options.showNextMoveDeltaRemotenesses ? availableMove.moveValueOpacity : 1 }" @click="store.dispatch(actionTypes.runMove, availableMove.move)">{{ availableMove.move }}</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { actionTypes, useStore } from "../plugins/store";

    const store = useStore();

    const position = computed(() => {
        let position: string = store.state.app.game.round.position;
        position = position.replace(/^;/, "");
        position = position.replace(/;$/, "");
        position = position.replace(/;/g, "\n");
        position = position.replace(/=/g, " = ");
        return position;
    });
</script>

<style lang="scss" scoped>
    #app-game-board-default-position-value {
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        display: inline-block;
        padding: 0.5em;
    }
    #app-game-board-default-moves-buttons {
        padding: 0.5em 20%;
    }
</style>
