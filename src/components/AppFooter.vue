<template>
    <p id="app-footer">
        <a v-for="externalLink in externalLinks" :="externalLink.attributes">{{ externalLink.value }}</a>
    </p>
</template>

<script lang="ts" setup>
    import { useStore } from "../plugins/store";

    const store = useStore();
    const commonAttributes = { rel: "noopener noreferrer nofollow", target: "_blank" };
    const externalLinks = [
        { attributes: { href: "https://github.com/GamesCrafters/GamesmanUni", ...commonAttributes }, value: `GamesmanUni v${store.state.app.version}` },
        { attributes: { href: "https://github.com/GamesCrafters/GamesCraftersUWAPI", ...commonAttributes }, value: "GamesCraftersUWAPI" },
        { attributes: { href: "https://github.com/GamesCrafters/GamesmanUni", ...commonAttributes }, value: "GitHub" },
        { attributes: { href: "https://sites.google.com/berkeley.edu/gamesmanuni-doc", ...commonAttributes }, value: "Documentation" },
        { attributes: { href: "https://gamescrafters.berkeley.edu", ...commonAttributes }, value: "© GamesCrafters" },
        { attributes: { href: "https://regents.universityofcalifornia.edu", ...commonAttributes }, value: "© UC Regents" },
    ];
</script>

<style lang="scss" scoped>
    #app-footer {
        text-align: center;
        a {
            display: inline-block;
        }
    }
</style>
