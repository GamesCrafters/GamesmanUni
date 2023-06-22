<template>
    <div id="app-demo-body-header">
        <AppDemoBodyHeaderTitle />
    </div>
</template>

<script lang="ts" setup>
    import AppDemoBodyHeaderTitle from "./AppDemoBodyHeaderTitle.vue";
</script>

<style lang="scss" scoped>
    #app-demo-body-header {
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
