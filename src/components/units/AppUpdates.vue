<template>
    <div id="app-updates">
        <h2 id="title">What's new!?</h2>
        <div class="row">
            <p id="description">
                If latest version listed here does not match <code>GamesmanUni</code> version in footer, new content is available.<br />
                Please try refreshing the page <code>ctrl/command + r</code> to get latest patches and updates.
                <!-- <br /><br /> -->
                <!-- All dates and times are in local timezone. -->
            </p>
        </div>
        <template v-if="Object.keys(latestCommits).length">
            <a class="commit row" v-for="commit in latestCommits.commits" :key="commit.sha" :href="commit.url" target="_blank" rel="noreferrer">
                <div class="message">
                    <VueMarkdownIt :linkify="true" :plugins="plugins" :source="commit.message" />
                </div>
                <p class="author">
                    <img class="avatar" :alt="commit.authorName + `'s Avatar`" :title="commit.authorName" :src="getAuthorAvatarSource(commit.authorAvatarUrl)" style="width: 2rem" />
                    <span class="name">{{ commit.authorName }}</span>
                </p>
                <!-- Temporarily disabled due to a bug in moment timezone failing the production build. -->
                <!-- <p>{{ moment(commit.date).tz(moment.tz.guess(true)).format("LLLL") }}</p> -->
            </a>
        </template>
        <div class="row" v-else>
            <p id="failure">Failed to load GitHub commit history to this site.</p>
        </div>
        <div class="row">
            <a id="more" href="https://github.com/GamesCrafters/GamesmanUni/commits/main" target="_blank" rel="noreferrer"> Please visit GitHub for complete update history... </a>
        </div>
    </div>
</template>

<script lang="ts" setup>
    // import moment from "moment-timezone";
    import VueMarkdownIt from "vue3-markdown-it";
    import MarkdownItLinkAttributes from "markdown-it-link-attributes";
    import { actionTypes, useStore } from "../../scripts/plugins/store";

    const store = useStore();
    const plugins = [{ plugin: MarkdownItLinkAttributes, options: { attrs: { target: "_blank", rel: "noopener noreferrer nofollow" } } }];
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
        * {
            text-decoration: none;
            word-wrap: break-word;
        }
        > * {
            flex: 0 1 auto;
            padding: 0.5rem 2rem;
        }
        > #title {
            margin: 1rem;
        }
        > .row {
            border-radius: 1rem;
            border: 0.1rem solid var(--neutralColor);
            > .author {
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
                > .avatar {
                    border-radius: 100%;
                }
            }
        }
    }
</style>
