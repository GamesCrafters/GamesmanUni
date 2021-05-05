<template>
    <h2>What's new!?</h2>
    <p id="app-updates-warning">
        If latest version listed here does not match <code>GamesmanUni</code> version in footer, new content is available.<br />
        Please try refreshing the page <code>ctrl/command + r</code> to get latest patches and updates.<br /><br />
        All datetimes below are in UTC.
    </p>
    <a v-if="success" class="app-updates-commit-link" v-for="commit in latestCommitHistory" :key="commit.sha" :href="commit.url" target="_blank" rel="noreferrer">
        <span class="app-updates-commit-date">{{ commit.date }}</span>
        <img class="app-updates-commit-author" :alt="commit.authorName + `'s Avatar`" :title="commit.authorName" :src="commit.authorAvatarUrl ? commit.authorAvatarUrl : getFallbackAuthorAvatarSource()" height="25" />
        <span class="app-updates-commit-message">{{ commit.message }}</span>
    </a>
    <p v-else="success" id="app-updates-failed">Failed to load GitHub commit history to this site.</p>
    <a id="app-updates-more" href="https://github.com/GamesCrafters/GamesmanUni/commits/main" target="_blank" rel="noreferrer"> Visit GitHub for complete update history... </a>
</template>

<script lang="ts" setup>
    import { ref } from "vue";
    import type { Ref } from "vue";
    import { actionTypes, useStore } from "../plugins/store";
    import type { AppLatestCommitHistoryData } from "../scripts/gamesmanUniTypes";

    const store = useStore();
    const success = ref(false);
    const latestCommitHistory: Ref<AppLatestCommitHistoryData | undefined> = ref(undefined);
    store.dispatch(actionTypes.loadLatestCommitHistory).then(() => {
        if (store.state.app.latestCommitHistory) {
            success.value = true;
            latestCommitHistory.value = store.state.app.latestCommitHistory;
        }
    });
    const getFallbackAuthorAvatarSource = () => {
        const images = import.meta.globEager("../models/images/logo-gamescrafters.png");
        const appLogoFilePath = "../models/images/logo-gamescrafters.png";
        return images[appLogoFilePath].default;
    };
</script>

<style lang="scss" scoped>
    #app-updates-warning {
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        font-style: italic;
        line-height: 1.5em;
        margin: 0 10%;
        padding: 1em 5em;
        text-align: center;
        code {
            display: inline-block;
        }
    }
    .app-updates-commit-link {
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 0 10%;
        padding: 0.25em;
        text-decoration: none;
        > * {
            line-height: 1.5em;
            margin: 0 0.25em;
            padding: 0 0.25em;
            text-align: left;
        }
    }

    .app-updates-commit-date {
        font-weight: bold;
        text-align: center;
    }

    .app-updates-commit-message {
        flex: 2 1 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .app-updates-commit-author {
        flex: 0 1 0;
        border-radius: 100%;
    }

    #app-updates-more {
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        display: block;
        font-style: italic;
        font-weight: normal;
        line-height: 1.5em;
        margin: 0 10%;
        padding: 2em;
        text-decoration: none;
    }

    #app-updates-failed {
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        display: block;
        font-style: italic;
        font-weight: bold;
        line-height: 1.5em;
        margin: 0 10%;
        padding: 2em;
        text-align: center;
        text-decoration: none;
    }
</style>
