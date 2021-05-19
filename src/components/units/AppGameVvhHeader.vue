<template>
    <div id="app-game-vvh-header">
        <AppGameVvhHeaderGuidesOptions />
        <AppGameVvhHeaderTitle />
        <AppGameVvhHeaderMetersOptions />
    </div>
</template>

<script lang="ts" setup>
    import AppGameVvhHeaderGuidesOptions from "./AppGameVvhHeaderGuidesOptions.vue";
    import AppGameVvhHeaderMetersOptions from "./AppGameVvhHeaderMetersOptions.vue";
    import AppGameVvhHeaderTitle from "./AppGameVvhHeaderTitle.vue";
</script>

<style lang="scss" scoped>
    #app-game-vvh-header {
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
