<template>
    <AppWelcome />
</template>

<script lang="ts" setup>
    import { useMeta } from "vue-meta";
    import AppWelcome from "../units/AppWelcome.vue";

    useMeta({ title: "Home" });
</script>
