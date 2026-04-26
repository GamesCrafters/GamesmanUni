<template>
    <div id="app-game-body-statistics-status" :class="{ loading: backgroundLoading }">
        <span class="status-dot"></span>
        <p>{{ status }}</p>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../../scripts/plugins/store";

    const store = useStore();
    const backgroundLoading = computed(() => store.getters.backgroundLoading);
    const status = computed(() => backgroundLoading.value ? "Loading..." : "Ready");
</script>

<style lang="scss" scoped>
    #app-game-body-statistics-status {
        display: flex;
        align-items: center;
        gap: 7px;
        flex: 0 0 auto;

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--gu-status-dot);
            flex-shrink: 0;
        }

        &.loading .status-dot {
            background: #FDB515;
        }

        > p {
            font-size: 13px;
            font-weight: 500;
            color: var(--gu-status-text);
        }
    }
</style>
