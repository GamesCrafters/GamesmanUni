<template>
    <AppGameVariants />
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useMeta } from "vue-meta";
    import { useStore } from "../plugins/store";
    import AppGameVariants from "./AppGameVariants.vue";

    const store = useStore();
    const computedMeta = computed(() => ({
        title: `${store.state.app.game.name} Variants`,
    }));
    useMeta(computedMeta);
</script>
