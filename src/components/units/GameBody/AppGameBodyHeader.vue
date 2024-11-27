<template>
    <div id="app-game-body-header">
        <button> ← </button>
        <AppGameBodyHeaderInstructions />
        <AppGameBodyHeaderTitle />
        <AppGameBodyHeaderOptions />
        <AppGameBodyHeaderScorecard />
    </div>
</template>

<script lang="ts" setup>
    import AppGameBodyHeaderTitle from "./AppGameBodyHeaderTitle.vue";
    import AppGameBodyHeaderInstructions from "./AppGameBodyHeaderInstructions.vue";
    import AppGameBodyHeaderOptions from "./AppGameBodyHeaderOptions.vue";
    import AppGameBodyHeaderScorecard from "./AppGameBodyHeaderScorecard.vue";

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

        button {
            border-radius: 100%;
            font-size: 2rem;
            height: max(2.5rem, min(5vh, 5vw));
            width: max(2.5rem, min(5vh, 5vw));
        }
    }
</style>
