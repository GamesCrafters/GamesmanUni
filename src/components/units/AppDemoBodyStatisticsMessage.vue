<template>
    <div id="app-demo-body-statistics-message">
        <p>Demo in progress.</p>
        <AppGameBodyStatisticsMessage />
    </div>
</template>

<script lang="ts" setup>
    import AppGameBodyStatisticsMessage from "./AppGameBodyStatisticsMessage.vue";
</script>

<style lang="scss" scoped>
    #app-demo-body-statistics-message {
        > * {
            border-radius: 1rem;
            border: 0.1rem solid var(--neutralColor);
            padding: 0.5rem;
            text-align: center;
        }
    }
</style>
