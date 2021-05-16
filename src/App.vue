<template>
    <metainfo>
        <template v-slot:title="{ content }">{{ content }} | GamesmanUni</template>
    </metainfo>
    <AppHeader />
    <router-view />
    <AppFooter />
</template>

<script lang="ts" setup>
    import AppHeader from "./components/units/AppHeader.vue";
    import AppFooter from "./components/units/AppFooter.vue";
</script>

<style lang="scss">
    @forward "styles";
    #app {
        align-content: stretch;
        align-items: stretch;
        background-color: var(--backgroundColor);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 100%;
        width: 100%;
    }
</style>
