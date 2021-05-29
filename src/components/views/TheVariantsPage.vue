<template>
    <AppGameVariants />
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useMeta } from "vue-meta";
    import { useRoute } from "vue-router";
    import { useStore } from "../../scripts/plugins/store";
    import AppGameVariants from "../units/AppGameVariants.vue";

    const route = useRoute();
    const store = useStore();
    const game = computed(() => store.getters.games(route.params.type as string) ? store.getters.games(route.params.type as string).games[route.params.gameId as string] : undefined);
    const gameName = computed(() => (game.value ? game.value.name : ""));
    useMeta(computed(() => ({ title: `${gameName.value} Variants` })));
</script>
