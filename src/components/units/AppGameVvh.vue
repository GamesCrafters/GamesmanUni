<template>
    <div id="app-game-vvh" v-if="showVvh">
        <AppGameVvhHeader />
        <AppGameVvhBody />
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import AppGameVvhHeader from "./AppGameVvhHeader.vue";
    import AppGameVvhBody from "./AppGameVvhBody.vue";
    import { useStore } from "../../scripts/plugins/store";

    const store = useStore();
    const options = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.options : undefined));
    const showVvh = computed(() => (options.value ? options.value.showVvh : true));
</script>

<style lang="scss" scoped>
    #app-game-vvh {
        align-content: normal;
        align-items: stretch;
        flex: 3 1 auto;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
    }
</style>
