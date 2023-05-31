<template>
    <AppTournament />
</template>

<script lang="ts" setup>
    import AppTournament from "../units/Tournament/AppTournament.vue";
    import { useMeta } from "vue-meta";

    useMeta({ title: "Tournament" });
</script>
