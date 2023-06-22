<template>
    <header id="app-header">
        <AppHeaderTitle />
        <AppHeaderNavigations />
        <AppHeaderPreferences />
    </header>
</template>

<script lang="ts" setup>
    import AppHeaderTitle from "./AppHeaderTitle.vue";
    import AppHeaderNavigations from "./AppHeaderNavigations.vue";
    import AppHeaderPreferences from "./AppHeaderPreferences.vue";
</script>

<style lang="scss" scoped>
    #app-header {
        align-content: center;
        align-items: center;
        background-color: var(--neutralColor);
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        * {
            margin: 0.5rem 0;
        }
        > AppHeaderLogo,
        > AppHeaderPreferences {
            flex: 0 1 auto;
        }
        > AppHeaderNavigations {
            flex: 1 1 auto;
        }
    }
</style>
