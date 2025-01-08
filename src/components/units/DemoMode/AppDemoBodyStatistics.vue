<template>
    <div id="app-demo-body-statistics">
        <div class="row">
            <AppGameBodyStatisticsData />
            <AppDemoV/>
        </div>
        <div class="row">
            <AppGameBodyStatisticsStatus />
            <AppGameBodyStatisticsMessage />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import AppGameBodyStatisticsData from "../GameBody/AppGameBodyStatisticsData.vue";
    import AppDemoV from "./AppDemoV.vue";
    import AppGameBodyStatisticsStatus from "../GameBody/AppGameBodyStatisticsStatus.vue";
    import AppGameBodyStatisticsMessage from "../GameBody/AppGameBodyStatisticsMessage.vue";
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