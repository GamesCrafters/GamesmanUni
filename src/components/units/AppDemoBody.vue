<template>
    <div id="app-demo-body">
        <AppDemoBodyHeader />
        <AppDemoBodyStatistics />
        <h3>Computer Move Duration (milliseconds)</h3>
        <VueSlider id="slider"
            v-model="options.computerMoveDuration"
            :min="0"
            :max="10000"
            :interval="100"
            :tooltip="'active'" 
        />
        <AppDemoBodyBoard />
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../scripts/plugins/store";
    import AppDemoBodyHeader from "./AppDemoBodyHeader.vue";
    import AppDemoBodyStatistics from "./AppDemoBodyStatistics.vue";
    import AppDemoBodyBoard from "./AppDemoBodyBoard.vue";
    import VueSlider from "vue-slider-component";

    const store = useStore();
    const options = computed(() => (store.getters.options));
</script>

<style lang="scss" scoped>
    #app-demo-body {
        align-content: normal;
        align-items: stretch;
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
        max-width: min(100vw, 60vh);
    }
</style>
