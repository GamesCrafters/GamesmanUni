<template>
    <AppPuzzles />
</template>

<script lang="ts" setup>
    import { useMeta } from "vue-meta";
    import AppPuzzles from "./AppPuzzles.vue";

    useMeta({
        title: "Puzzles",
    });
</script>
