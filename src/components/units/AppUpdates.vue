<template>
    <div id="app-updates">
        <h2 id="title">What's new!?</h2>
        <p>
            If latest version listed here does not match <code>GamesmanUni</code> version in footer, new content is available.<br />
            Please try refreshing the page <code>ctrl/command + r</code> to get latest patches and updates.<br /><br />
            All dates and times are in local timezone.
        </p>
        <template v-if="Object.keys(latestCommits).length">
            <a v-for="commit in latestCommits.commits" :key="commit.sha" :href="commit.url" target="_blank" rel="noreferrer">
                <p>{{ commit.message }}</p>
                <p>
                    <img :alt="commit.authorName + `'s Avatar`" :title="commit.authorName" :src="getAuthorAvatarSource(commit.authorAvatarUrl)" style="width: 2rem" />
                    <span>{{ commit.authorName }}</span>
                </p>
                <!-- Temporarily disabled due to a bug in moment timezone failing the production build. -->
                <!-- <p>{{ moment(commit.date).tz(moment.tz.guess(true)).format("LLLL") }}</p> -->
            </a>
        </template>
        <p v-else>Failed to load GitHub commit history to this site.</p>
        <a href="https://github.com/GamesCrafters/GamesmanUni/commits/main" target="_blank" rel="noreferrer"> Please visit GitHub for complete update history... </a>
    </div>
</template>

<script lang="ts" setup>
    // import moment from "moment-timezone";
    import { actionTypes, useStore } from "../../scripts/plugins/store";

    const store = useStore();
    const latestCommits = store.getters.commits;
    const getAuthorAvatarSource = (url?: string) => {
        if (url) return url;
        return import.meta.globEager("../../models/images/logo-gamescrafters.png")["../../models/images/logo-gamescrafters.png"].default;
    };
    store.dispatch(actionTypes.loadLatestCommits);
</script>

<style lang="scss" scoped>
    #app-updates {
        align-content: normal;
        align-items: stretch;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        height: 100%;
        justify-content: center;
        padding: 1rem 10%;
        > * {
            flex: 0 1 auto;
            text-align: center;
            padding: 1rem;
        }
        > #title {
            margin: 1rem;
        }
        > a {
            border-radius: 1rem;
            border: 0.1rem solid var(--neutralColor);
            text-decoration: none;
            > p {
                align-content: normal;
                align-items: center;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: flex-start;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                > * {
                    margin: 0 1rem;
                    text-align: left;
                }
                > img {
                    border-radius: 100%;
                }
            }
        }
        > p {
            border: 0.1rem solid var(--neutralColor);
            border-radius: 1rem;
            font-style: italic;
            > code {
                display: inline-block;
            }
        }
    }
</style>
