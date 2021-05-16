<template>
    <AppUpdates />
</template>

<script lang="ts" setup>
    import { useMeta } from "vue-meta";
    import AppUpdates from "../units/AppUpdates.vue";

    useMeta({ title: "Updates" });
</script>
