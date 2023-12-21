<template>
    <div id="app-game-body-statistics-status">
        <p>{{ status }}</p>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../../scripts/plugins/store";

    const store = useStore();
    const backgroundLoading = computed(() => store.getters.backgroundLoading);
    const status = computed(() => backgroundLoading.value ? "Loading..." : " Ready ");
</script>

<style lang="scss" scoped>
    #app-game-body-statistics-status {
        border-radius: 1rem;
        border: 0.1rem solid var(--neutralColor);
        align-content: stretch;
        align-items: center;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-around;
        > p {
            padding: 1rem;
            text-align: center;
        }
    }
</style>
