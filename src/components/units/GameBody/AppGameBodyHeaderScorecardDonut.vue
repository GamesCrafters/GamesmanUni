<template>
    <div id="app-game-body-header-scorecard-donut">
        <div id="donut">
            <div>{{ currentTotalWins }}</div>
            <div> {{ currentPlayerWinsMap }} </div>
            
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { mutationTypes, useStore } from "../../../scripts/plugins/store";

    const store = useStore();
    const currentTotalWins = computed(() => store.getters.currentTotalWins);
    const currentPlayerWinsMap = computed(() => store.getters.currentPlayerWinsMap);

</script>

<style lang="scss" scoped>
    
</style>
