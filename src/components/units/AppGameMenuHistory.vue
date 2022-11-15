<template>
    <div id="app-game-menu-history">
        <AppGameMenuHistoryImport />
        <AppGameMenuHistoryExport />
    </div>
</template>

<script lang="ts" setup>
    import AppGameMenuHistoryImport from "./AppGameMenuHistoryImport.vue";
    import AppGameMenuHistoryExport from "./AppGameMenuHistoryExport.vue";
</script>

<style lang="scss" scoped>
    #app-game-menu-history {
        flex: 1 1 auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-evenly;
        margin: 2rem; 
    }
</style>
