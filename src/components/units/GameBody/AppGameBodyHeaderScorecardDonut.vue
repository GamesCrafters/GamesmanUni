<template>
    <div id="app-game-body-header-scorecard-donut">
        <div id="donut">
            <div>{{ currentGamesPlayed }}</div>
            <div> {{ currentPlayerWinsMap }} </div>
            
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { mutationTypes, useStore } from "../../../scripts/plugins/store";

    const store = useStore();
    const currentGamesPlayed = computed(() => store.getters.currentGamesPlayed);
    const currentPlayerWinsMap = computed(() => store.getters.currentPlayerWinsMap);

</script>

<style lang="scss" scoped>
    
</style>
