<template>
    <div id="app-game-body-statistics">
        <div class="row">
            <AppGameBodyStatisticsData />
            <AppGameBodyStatisticsMoves />
        </div>
        <div class="row">
            <AppGameBodyStatisticsStatus />
            <AppGameBodyStatisticsMessage />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import AppGameBodyStatisticsMoves from "./AppGameBodyStatisticsMoves.vue";
    import AppGameBodyStatisticsData from "./AppGameBodyStatisticsData.vue";
    import AppGameBodyStatisticsStatus from "./AppGameBodyStatisticsStatus.vue";
    import AppGameBodyStatisticsMessage from "./AppGameBodyStatisticsMessage.vue";
</script>

<style lang="scss" scoped>
    #app-game-body-statistics {
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
