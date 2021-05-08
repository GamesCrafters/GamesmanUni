<template>
    <h3>Position</h3>
    <pre id="app-game-board-fallback-position">{{ position }}</pre>
    <template v-if="store.state.app.game.options.showNextMoves">
        <hr class="c-divider" />
        <h3>Move(s)</h3>
        <div id="app-game-board-fallback-available-move-buttons">
            <button v-for="availableMove in store.state.app.game.round.availableMoves" :key="availableMove.move" :class="store.state.app.game.options.showNextMoveHints ? `c-${availableMove.moveValue}` : ''" :style="{ opacity: store.state.app.game.options.showNextMoveDeltaRemotenesses ? availableMove.moveValueOpacity : 1 }" @click="store.dispatch(actionTypes.runMove, availableMove.move)">{{ availableMove.move }}</button>
        </div>
    </template>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { actionTypes, useStore } from "../plugins/store";

    const store = useStore();
    const position = computed(() => store.state.app.game.round.position.replace(/^;/, "").replace(/;$/, "").replace(/;/g, "\n").replace(/=/g, " = "));
</script>

<style lang="scss" scoped>
    #app-game-board-fallback-position {
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        display: inline-block;
        padding: 0.5em;
    }
    #app-game-board-fallback-available-move-buttons {
        padding: 0.5em 20%;
    }
</style>
