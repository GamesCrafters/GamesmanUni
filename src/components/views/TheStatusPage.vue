<template>
    <AppStatus />
</template>

<script lang="ts" setup>
    import { useMeta } from "vue-meta";
    import AppStatus from "../units/Status/AppStatus.vue";

    useMeta({ title: "Status" });
</script>
