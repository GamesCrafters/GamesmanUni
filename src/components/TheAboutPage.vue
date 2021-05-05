<template>
    <AppAbout />
</template>

<script lang="ts" setup>
    import { useMeta } from "vue-meta";
    import AppAbout from "./AppAbout.vue";

    useMeta({
        title: "About",
    });
</script>
