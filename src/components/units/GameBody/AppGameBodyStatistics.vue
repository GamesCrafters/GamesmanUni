<template>
    <div id="app-game-body-statistics">
        <div class="row row-controls">
            <AppGameBodyStatisticsData />
            <AppGameBodyStatisticsMoves />
        </div>
        <div class="row row-status" :class="{ 'analytics-open': showMenu }">
            <AppGameBodyStatisticsStatus />
            <AppGameBodyStatisticsMessage />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../../scripts/plugins/store";
    import AppGameBodyStatisticsMoves from "./AppGameBodyStatisticsMoves.vue";
    import AppGameBodyStatisticsData from "./AppGameBodyStatisticsData.vue";
    import AppGameBodyStatisticsStatus from "./AppGameBodyStatisticsStatus.vue";
    import AppGameBodyStatisticsMessage from "./AppGameBodyStatisticsMessage.vue";

    const store = useStore();
    const showMenu = computed(() => store.getters.options?.showMenu ?? true);
</script>

<style lang="scss" scoped>
    #app-game-body-statistics {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding-bottom: 0.75rem;
    }

    .row {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6px;

        > * { flex: 1 1 auto; }
    }

    .row-status {
        background: var(--gu-status-bg);
        border-radius: 8px;
        padding: 8px 12px;
        &.analytics-open {
            :deep(p) { color: #ffffff; }

            :deep(mark.uni-win)  { color: #ffffff; font-weight: 600; }
            :deep(mark.uni-lose) { color: #ffffff; font-weight: 600; }
            :deep(mark.uni-draw) { color: #000000; font-weight: 600; }
            :deep(mark.uni-tie)  { color: #000000; font-weight: 600; }

            :deep(.mex-str) { color: rgba(255, 255, 255, 0.8); }
        }
    }
</style>
