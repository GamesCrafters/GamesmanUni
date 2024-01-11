<template>
    <AppGame />
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useMeta } from "vue-meta";
    import { useRoute } from "vue-router";
    import { useStore } from "../../scripts/plugins/store";
    import AppGame from "../units/AppGame.vue";

    const route = useRoute();
    const store = useStore();
    const game = computed(() => store.getters.games ? store.getters.games[route.params.gameId as string] : undefined);
    const gameName = computed(() => (game.value ? game.value.name : ""));
    const variantName = computed(() => (game.value && game.value.variants[route.params.variantId as string] ? game.value.variants[route.params.variantId as string].name : ""));
    useMeta(computed(() => ({ title: `${variantName.value} ${gameName.value}` })));
</script>
