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
    const game = computed(() => store.getters.games(route.params.type as string).games[route.params.gameId as string]);
    const gameName = computed(() => (game.value ? game.value.name : ""));
    const variantDescription = computed(() => (game.value && game.value.variants.variants[route.params.variantId as string] ? game.value.variants.variants[route.params.variantId as string].description : ""));
    useMeta(computed(() => ({ title: `${variantDescription.value} ${gameName.value}` })));
</script>
