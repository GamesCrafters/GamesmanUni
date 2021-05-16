<template>
    <nav id="app-header-navigations">
        <router-link v-for="route in routes" :key="route.name" :to="route.path">
            <h2>{{ route.name }}</h2>
        </router-link>
    </nav>
</template>

<script lang="ts" setup>
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
