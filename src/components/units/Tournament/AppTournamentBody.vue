<template>
    <div id="app-tournament-body">
        <component :is="getGameBoardComponent" />
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../../scripts/plugins/store";
    import AppTournamentHeader from "./AppTournamentHeader.vue";
    import AppTournamentImageBody from "./AppTournamentImageBody.vue";
    import CharacterAutoGUI from "../GameBody/CharacterAutoGUI.vue";
    import AppTournamentTTT from "./AppTournamentTTT.vue";
    import AppTournamentSim from "./AppTournamentSim.vue";

    const store = useStore();
    const gameId = computed(() => store.getters.currentGameId);
    const variantId = computed(() => store.getters.currentVariantId);
    const position = computed(() => store.getters.currentPosition);
    const getGameBoardComponent = computed(() => {
        if (gameId.value === 'ttt') return AppTournamentTTT;
        if (gameId.value === 'sim') return AppTournamentSim;
        if (position.value.match(/^R_(A|B)_([0-9]+)_([0-9]+)_([a-zA-Z0-9-\*]+)(?:_(.*))?$/)) return AppTournamentImageBody;
        return CharacterAutoGUI;
    });
</script>

<style lang="scss" scoped>
    #app-tournament-body {
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