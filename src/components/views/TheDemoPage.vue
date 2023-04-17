<template>
    <AppDemo />
</template>

<script lang="ts" setup>
    import AppDemo from "../units/AppDemo.vue";
    import { useMeta } from "vue-meta";

    useMeta({ title: "Demo" });
</script>
