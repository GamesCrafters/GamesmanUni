<template>
    <div id="app-game-vvh">
        <AppGameVvhHeader />
        <AppGameVvhBody />
    </div>
</template>

<script lang="ts" setup>
    import AppGameVvhHeader from "./AppGameVvhHeader.vue";
    import AppGameVvhBody from "./AppGameVvhBody.vue";
</script>

<style lang="scss" scoped>
    #app-game-vvh {
        align-content: normal;
        align-items: stretch;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
    }
</style>
