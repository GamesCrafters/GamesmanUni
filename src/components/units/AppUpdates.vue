<template>
    <div id="app-updates">
        <h2 id="title">What's new!?</h2>
        <div id="body">
            <template v-if="Object.keys(latestCommits).length">
                <a id="description" href="javascript:wlocation.reload()">
                    If latest version listed here does not match <code>GamesmanUni</code> version in footer, new content is available.<br />
                    Please try refreshing the page <code>ctrl/command + r</code> to get latest patches and updates. <br />
                    All dates and times are in local timezone.
                </a>
                <div id="commits">
                    <a class="commit" v-for="commit in latestCommits.commits" :key="commit.sha" :href="commit.url" target="_blank" rel="noreferrer">
                        <h3 class="commit-version">{{ commit.message.split(/:(.+)/)[0] }}</h3>
                        <i class="message">{{ commit.message.split(/:(.+)/)[1].split(/\n(.+)/)[0] }}</i>
                        <span class="author">
                            <img class="avatar" :alt="commit.authorName + `'s Avatar`" :title="commit.authorName" :src="getAuthorAvatarSource(commit.authorAvatarUrl)" style="width: 3rem" />
                            <b class="name">{{ commit.authorName }}</b>
                        </span>
                        <time class="datetime" :datetime="commit.date">{{ new Date(commit.date).toLocaleTimeString() }}<br />{{ new Date(commit.date).toLocaleDateString() }}</time>
                    </a>
                </div>
            </template>
            <p id="failure" v-else>Failed to load GitHub commit history to this site.</p>
        </div>
        <a id="more" href="https://github.com/GamesCrafters/GamesmanUni/commits/main" target="_blank" rel="noreferrer"> Please visit GitHub for complete update history... </a>
    </div>
</template>

<script lang="ts" setup>
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
        padding: 1rem 10%;
        * {
            text-decoration: none;
            word-wrap: break-word;
        }
        > #title {
            margin: 1rem;
        }
        #body {
            > #description {
                margin: 1rem;
            }
            > #commits {
                align-content: center;
                align-items: center;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
                > .commit {
                    align-content: normal;
                    align-items: center;
                    border-radius: 1rem;
                    border: 0.1rem solid var(--neutralColor);
                    display: flex;
                    flex-direction: column;
                    flex-wrap: nowrap;
                    justify-content: center;
                    margin: 1rem;
                    padding: 1rem;
                    width: 13rem;
                    > * {
                        padding: 1rem 0;
                    }
                    > .message {
                        font-size: 0.8rem;
                        min-height: 3rem;
                        line-height: 1rem;
                        text-align: center;
                    }
                    > .author {
                        align-content: normal;
                        align-items: center;
                        display: flex;
                        flex-direction: column;
                        flex-wrap: nowrap;
                        justify-content: center;
                        > .avatar {
                            border-radius: 100%;
                        }
                    }
                    > .datetime {
                        font-size: 0.8rem;
                        line-height: 1rem;
                    }
                }
            }
            #failure {
                margin: 1rem;
            }
        }
        #more {
            margin: 1rem;
        }
    }
</style>
