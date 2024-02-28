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
        { path: "/puzzles", name: "Puzzles" },
        { path: "/games", name: "Games" },
        { path: "/about", name: "About" },
        { path: "/updates", name: "Updates" },
    ];
</script>

<style lang="scss" scoped>
    #app-header-navigations {
        width: 40%;
        align-content: center;
        align-items: center;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        > a {
            font-size: 1.5em;
            text-decoration: none;
            padding-left: 0.7em;
            padding-right: 0.7em;
            > h2 {
                font-weight: 500;
                color: var(--primaryColor);
                margin: 0 0.5rem;
            }
        }

        > a:hover {
            color: var(--backgroundColor);
        }

        > a.router-link-exact-active {
            color: var(--primaryColor);
            text-decoration: solid underline var(--primaryColor) 10%;
        }

        > a.router-link-exact-active:hover {
            color: var(--backgroundColor);
            text-decoration: solid underline var(--backgroundColor) 10%;
        }
    }
</style>

<i18n lang="json">
{
    "zh": {
        "Home": "首页",
        "Puzzles": "单人解谜",
        "Games": "双人游戏",
        "About": "关于",
        "Updates": "更新日志"
    },
    "en-US": {
        "Home": "Home",
        "Puzzles": "Puzzles",
        "Games": "Games",
        "About": "About",
        "Updates": "Updates"
    },
    "es": {
        "Home": "Inicio",
        "Puzzles": "Rompecabezas",
        "Games": "Juegos",
        "About": "Información",
        "Updates": "Versiones"
    },
    "hi": {
        "Home": "Home",
        "Puzzles": "Puzzles",
        "Games": "Games",
        "About": "About",
        "Updates": "Updates"
    }
}
</i18n>
