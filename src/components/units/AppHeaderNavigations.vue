<template>
    <nav id="app-header-navigations">
        <router-link v-for="route in routes" :key="route.name" :to="route.path">
            <h2>{{ t(route.name) }}</h2>
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
        align-content: center;
        align-items: center;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        > a > h2 {
            color: var(--primaryColor);
            margin: 0 0.5rem;
        }
        > a.router-link-exact-active {
            color: var(--themeColor);
            > h2 {
                color: var(--themeColor);
            }
        }
    }
</style>

<i18n lang="json">
{
    "cn": {
        "Home": "首页",
        "Puzzles": "单人解谜",
        "Games": "双人游戏",
        "About": "关于",
        "Updates": "更新日志"
    },
    "en": {
        "Home": "Home",
        "Puzzles": "Puzzles",
        "Games": "Games",
        "About": "About",
        "Updates": "Updates"
    },
    "es": {
        "Home": "Home",
        "Puzzles": "Puzzles",
        "Games": "Games",
        "About": "About",
        "Updates": "Updates"
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
