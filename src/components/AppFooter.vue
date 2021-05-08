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
        { attributes: { href: "https://github.com/GamesCrafters/GamesmanUni/tree/next", ...commonAttributes }, value: `GamesmanUni v${store.state.app.version}` },
        { attributes: { href: "https://nyc.cs.berkeley.edu/wiki/GamesmanUni_5", ...commonAttributes }, value: "RFC" },
        { attributes: { href: "https://github.com/GamesCrafters/GamesmanPuzzles", ...commonAttributes }, value: "GamesmanPuzzles" },
        { attributes: { href: "https://github.com/GamesCrafters/GamesCraftersUWAPI", ...commonAttributes }, value: "GamesCraftersUWAPI" },
        { attributes: { href: "https://gamescrafters.berkeley.edu", ...commonAttributes }, value: "© GamesCrafters" },
        { attributes: { href: "https://regents.universityofcalifornia.edu", ...commonAttributes }, value: "© UC Regents" },
    ];
</script>

<style lang="scss" scoped>
    #app-footer {
        text-align: center;
        &::first-line {
            text-indent: 0;
        }
        a {
            display: inline-block;
        }
    }
</style>
