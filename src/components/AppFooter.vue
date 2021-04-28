<template>
    <div id="app-footer">
        <span class="app-footer-externalLink" v-for="externalLink in externalLinks">
            <a :="externalLink.attributes">{{ externalLink.value }}</a>
        </span>
    </div>
</template>

<script lang="ts" setup>
    import { useStore } from "../plugins/store";

    const store = useStore();

    const externalLinkAttributes = {
        rel: "noopener noreferrer nofollow",
        target: "_blank",
    };
    const externalLinks = [
        {
            attributes: {
                href: "https://github.com/GamesCrafters/GamesmanUni",
                ...externalLinkAttributes,
            },
            value: `GamesmanUni v${store.state.app.version}`,
        },
        {
            attributes: {
                href: "https://github.com/GamesCrafters/GamesCraftersUWAPI",
                ...externalLinkAttributes,
            },
            value: "GamesCraftersUWAPI",
        },
        {
            attributes: {
                href: "https://github.com/GamesCrafters/GamesmanUni",
                ...externalLinkAttributes,
            },
            value: "GitHub",
        },
        {
            attributes: {
                href: "https://sites.google.com/berkeley.edu/gamesmanuni-doc",
                ...externalLinkAttributes,
            },
            value: "Documentation",
        },
        {
            attributes: {
                href: "https://gamescrafters.berkeley.edu",
                ...externalLinkAttributes,
            },
            value: "© GamesCrafters",
        },
        {
            attributes: {
                href: "https://regents.universityofcalifornia.edu",
                ...externalLinkAttributes,
            },
            value: "© UC Regents",
        },
    ];
</script>

<style lang="scss" scoped>
    #app-footer {
        font-size: 1em;
        line-height: 2em;
    }
</style>
