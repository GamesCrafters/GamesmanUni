<template>
    <AppGame />
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useMeta } from "vue-meta";
    import { useStore } from "../plugins/store";
    import AppGame from "./AppGame.vue";

    const store = useStore();
    const computedMeta = computed(() => ({
        title: `${store.state.app.game.variant.description} ${store.state.app.game.name}`,
    }));
    useMeta(computedMeta);
</script>
