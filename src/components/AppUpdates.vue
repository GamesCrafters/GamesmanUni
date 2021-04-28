<template>
    <h2>What's new!?</h2>
    <div id="app-updates-warning">
        If latest version listed here does not match <code>GamesmanUni</code> version in footer, new content is available. Please try refreshing the page ( <code>ctrl/command + r</code>) to get latest patches and updates.
        <br />
        <br />
        All datetimes below are in UTC.
    </div>
    <div v-if="success">
        <a class="app-updates-commit-link" v-for="commit in latestCommitHistory" :key="commit.sha" :href="commit.url" target="_blank" rel="noreferrer">
            <div class="app-updates-commit-date">{{ commit.date }}</div>
            <div class="app-updates-commit-message">{{ commit.message }}</div>
            <img class="app-updates-commit-author" :alt="commit.authorName + `'s Avatar`" :title="commit.authorName" :src="commit.authorAvatarUrl ? commit.authorAvatarUrl : getFallbackAuthorAvatarSource()" height="25" />
        </a>
    </div>
    <div v-else="success">
        <p id="app-updates-failed">Failed to load GitHub commit history.</p>
    </div>
    <a id="app-updates-more" href="https://github.com/GamesCrafters/GamesmanUni/commits/main" target="_blank" rel="noreferrer"> For complete update history... </a>
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
        margin: 0 20%;
        padding: 2em;
    }

    .app-updates-commit-link {
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 0 20%;
        padding: 0 0.25em;
        text-decoration: none;
        > * {
            line-height: 1.5em;
            margin: 0 0.25em;
            padding: 0 0.25em;
            text-align: left;
        }
    }

    .app-updates-commit-date {
        flex: 1 1 0;
        font-weight: bold;
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
        margin: 0 20%;
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
        margin: 0 20%;
        padding: 2em;
        text-align: center;
        text-decoration: none;
    }
</style>
