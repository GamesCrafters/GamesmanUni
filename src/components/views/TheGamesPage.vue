<template>
    <AppGames />
</template>

<script lang="ts" setup>
    import { useMeta } from "vue-meta";
    import AppGames from "../units/AppGames.vue";

    useMeta({ title: "Games" });
</script>
