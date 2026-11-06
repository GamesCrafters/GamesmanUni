<template>
    <div id="app-footer">
        <a v-for="(externalLink, i) in externalLinks" :="externalLink.attributes" :key="'exLink'+ i">{{ externalLink.value }}</a>
        <router-link to="/demo">
            <a>Demo Mode</a>
        </router-link>
    </div>
</template>

<script lang="ts" setup>
    import { useStore } from "../../scripts/plugins/store";

    const store = useStore();
    const commonAttributes = { rel: "noopener noreferrer nofollow", target: "_blank" };
    const externalLinks = [
        { attributes: { href: "https://github.com/GamesCrafters/GamesmanUni", ...commonAttributes }, value: `GamesmanUni v${store.state.app.version}` },
        { attributes: { href: "https://github.com/GamesCrafters/GamesmanClassic", ...commonAttributes }, value: "GamesmanClassic" },
        { attributes: { href: "https://github.com/GamesCrafters/GamesmanPuzzles", ...commonAttributes }, value: "GamesmanPuzzles" },
        { attributes: { href: "https://github.com/GamesCrafters/GamesCraftersUWAPI", ...commonAttributes }, value: "GamesCraftersUWAPI" },
        { attributes: { href: "https://gamescrafters.berkeley.edu", ...commonAttributes }, value: "© GamesCrafters" },
        { attributes: { href: "https://regents.universityofcalifornia.edu", ...commonAttributes }, value: "© UC Regents" },
    ];
</script>

<style lang="scss" scoped>
    #app-footer {
        align-content: center;
        align-items: center;
        background-color: var(--gu-surface-hover);
        border-top: 1px solid var(--gu-border);
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        padding: 1rem 2rem;
        gap: 1.5rem;
        a {
            display: inline-block;
            font-size: 11px;
            color: var(--gu-text-muted);
            text-decoration: none;
            font-weight: 400;

            &:hover {
                color: var(--gu-brand);
            }
        }
    }
</style>
