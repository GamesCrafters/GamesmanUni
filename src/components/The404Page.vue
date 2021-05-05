<template>
    <h2>Page not found... 😔</h2>
    Path to <code>{{ $route.fullPath }}</code> does not exist.
</template>

<script lang="ts" setup>
    import { useMeta } from "vue-meta";

    useMeta({
        title: "Page Not Found",
    });
</script>
