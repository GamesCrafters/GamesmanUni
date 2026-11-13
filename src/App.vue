<template>
    <metainfo>
        <template v-slot:title="{ content }">{{ content }} | GamesmanUni</template>
    </metainfo>
    <AppHeader />
    <router-view />
    <AppFooter />
</template>

<script lang="ts" setup>
    import AppHeader from "./components/units/Header/AppHeader.vue";
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
        /* Not space-between: when a page is shorter than the viewport that
           pushes the leftover space between the header and the content,
           showing a band of --backgroundColor under the nav. Keep the content
           against the header and let the footer take up the slack instead. */
        justify-content: flex-start;
        min-height: 100%;
        width: 100%;

        > #app-footer {
            margin-top: auto;
        }
    }
</style>
