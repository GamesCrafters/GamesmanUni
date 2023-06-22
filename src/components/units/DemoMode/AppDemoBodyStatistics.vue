<template>
    <div id="app-demo-body-statistics">
        <div class="row">
            <AppDemoBodyStatisticsData />
            <AppDemoBodyStatisticsMessage />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import AppDemoBodyStatisticsData from "./AppDemoBodyStatisticsData.vue";
    import AppDemoBodyStatisticsMessage from "./AppDemoBodyStatisticsMessage.vue";
</script>

<style lang="scss" scoped>
    #app-demo-body-statistics {
        align-content: normal;
        align-items: stretch;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
        > .row {
            align-content: normal;
            align-items: stretch;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            > * {
                flex: 1 1 auto;
            }
        }
    }
</style>
