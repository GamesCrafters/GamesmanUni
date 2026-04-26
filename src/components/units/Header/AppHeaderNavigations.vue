<template>
    <nav id="app-header-navigations">
        <router-link v-for="route in routes" :key="route.name" :to="route.path">
            {{ t(route.name) }}
        </router-link>
    </nav>
</template>

<script lang="ts" setup>
    import { useI18n } from "vue-i18n";

    const { t } = useI18n();
    const routes = [
        { path: "/", name: "Home" },
        { path: "/games", name: "GamesAndPuzzles" },
        { path: "/about", name: "About" },
        { path: "/updates", name: "Updates" },
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

<i18n lang="json">
{
    "zh": {
        "Home": "首页",
        "GamesAndPuzzles": "游戏与解谜",
        "About": "关于",
        "Updates": "更新日志"
    },
    "en-US": {
        "Home": "Home",
        "GamesAndPuzzles": "Games & Puzzles",
        "About": "About",
        "Updates": "Updates"
    },
    "es": {
        "Home": "Inicio",
        "GamesAndPuzzles": "Juegos y rompecabezas",
        "About": "Información",
        "Updates": "Versiones"
    },
    "hi": {
        "Home": "Home",
        "GamesAndPuzzles": "Games & Puzzles",
        "About": "About",
        "Updates": "Updates"
    }
}
</i18n>
