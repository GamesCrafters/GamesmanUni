<template>
    <div id="app-game-body-header">
        <AppGameBodyHeaderScorecard />
        <AppGameBodyHeaderInstructions />
        <AppGameBodyHeaderTitle />
        <AppGameBodyHeaderOptions />
        <button v-if="options.showMenu" title="Toggle Analysis"
            @click="() => {options.showMenu = false; options.showNextMoves = false; options.showNextMoveHints = false; options.showNextMoveDeltaRemotenesses = false; options.highlightMove = false}"
        > &lt; </button>
        <button v-else title="Toggle Menu"
            @click="() => {options.showMenu = true; options.showNextMoves = true; options.showNextMoveHints = true; options.showNextMoveDeltaRemotenesses = true; options.highlightMove = true}"
        > &gt; </button>
    </div>
</template>

<script lang="ts" setup>
    import AppGameBodyHeaderTitle from "./AppGameBodyHeaderTitle.vue";
    import AppGameBodyHeaderInstructions from "./AppGameBodyHeaderInstructions.vue";
    import AppGameBodyHeaderOptions from "./AppGameBodyHeaderOptions.vue";
    import AppGameBodyHeaderScorecard from "./AppGameBodyHeaderScorecard.vue";
    
    import { useStore } from "../../../scripts/plugins/store";
    import { computed } from "vue";

    const store = useStore();
    const options = computed(() => store.getters.options);
</script>

<style lang="scss" scoped>
    #app-game-body-header {
        align-content: center;
        align-items: center;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        > * {
            margin: 1rem;
        }
    }

    button {
        border-radius: 100%;
        font-size: 2rem;
        height: max(2.5rem, min(5vh, 5vw));
        width: max(2.5rem, min(5vh, 5vw));
    }
</style>
