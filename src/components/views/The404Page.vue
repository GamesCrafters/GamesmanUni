<template>
    <AppPageNotFound />
</template>

<script lang="ts" setup>
    import { useMeta } from "vue-meta";
    import AppPageNotFound from "../units/AppPageNotFound.vue";

    useMeta({ title: "Page Not Found" });
</script>
