<template>
    <div id="app-game-body">
        <AppGameBodyHeader />
        <AppGameBodyStatistics />
        <AppGameBodyBoard />
    </div>
</template>

<script lang="ts" setup>
    import AppGameBodyHeader from "./AppGameBodyHeader.vue";
    import AppGameBodyStatistics from "./AppGameBodyStatistics.vue";
    import AppGameBodyBoard from "./AppGameBodyBoard.vue";
</script>

<style lang="scss" scoped>
    #app-game-body {
        align-content: normal;
        align-items: stretch;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
        margin: 0 0 1rem 0;
    }
</style>
