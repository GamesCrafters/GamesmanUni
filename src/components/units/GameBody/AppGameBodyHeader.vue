<template>
    <div id="app-game-body-header">
        <AppGameBodyHeaderInstructions />
        <AppGameBodyHeaderTitle />
        <AppGameBodyHeaderOptions />
    </div>
</template>

<script lang="ts" setup>
    import AppGameBodyHeaderTitle from "./AppGameBodyHeaderTitle.vue";
    import AppGameBodyHeaderInstructions from "./AppGameBodyHeaderInstructions.vue";
    import AppGameBodyHeaderOptions from "./AppGameBodyHeaderOptions.vue";
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
</style>
