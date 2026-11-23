<template>
    <nav id="app-header-navigations">
        <router-link v-for="route in routes" :key="route.name" :to="route.path">
            {{ t(route.key) }}
        </router-link>
    </nav>
</template>

<script lang="ts" setup>
    import { useI18n } from "vue-i18n";

    const { t } = useI18n({ useScope: "global" });
    const routes = [
        { path: "/", name: "Home", key: "nav.home" },
        { path: "/games", name: "GamesAndPuzzles", key: "nav.games" },
        { path: "/about", name: "About", key: "nav.about" },
        { path: "/updates", name: "Updates", key: "nav.updates" },
    ];
</script>

<style lang="scss" scoped>
    #app-header-navigations {
        display: flex;
        gap: 2rem;

        > a, > a:link, > a:visited, > a:hover, > a:active {
            text-decoration: none;
        }

        > a {
            font-size: 14px;
            font-weight: 400;
            color: var(--gu-text-body);
        }

        > a:hover {
            color: var(--gu-brand);
        }

        > a.router-link-active {
            color: var(--gu-brand);
            font-weight: 500;
        }

        > a.router-link-exact-active {
            color: var(--gu-brand);
            font-weight: 500;
        }

        > a.router-link-exact-active:hover {
            color: var(--gu-brand);
        }
    }
</style>

