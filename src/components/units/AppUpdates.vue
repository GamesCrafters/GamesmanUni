<template>
    <div id="app-updates">
        <h2 id="title"> {{ t("title") }} </h2>
        <div id="body">
            <template v-if="Object.keys(latestCommits).length">
                <a id="description" href="javascript:document.location.reload(true)">
                    {{ t("message0") }} <code>GamesmanUni</code> {{ t("message1") }} <br />
                    <code>ctrl/command + r</code> {{ t("message2") }} <br /> {{ t("message3") }}
                </a>
                <div id="commits">
                    <a class="commit" v-for="commit in latestCommits.commits" :key="commit.sha" :href="commit.url" target="_blank" rel="noreferrer">
                        <template v-if="commit.message.startsWith('v')">
                            <h3 class="commit-version">{{ commit.message.split(/:(.+)/)[0] }}</h3>
                            <i class="message">{{ commit.message.split(/:(.+)/)[1].split(/\n(.+)/)[0] }}</i>
                        </template>
                        <template v-else>
                            <i class="message">{{ commit.message }}</i>
                        </template>
                        <span class="author">
                            <img class="avatar" :alt="commit.authorName + `'s Avatar`" :title="commit.authorName" :src="getAuthorAvatarSource(commit.authorAvatarUrl)" style="width: 3rem" />
                            <b class="name">{{ commit.authorName }}</b>
                        </span>
                        <time class="datetime" :datetime="commit.date">{{ new Date(commit.date).toLocaleTimeString() }}<br />{{ new Date(commit.date).toLocaleDateString() }}</time>
                    </a>
                </div>
            </template>
            <p id="failure" v-else> {{ t("failureMessage") }} </p>
        </div>
        <a id="more" href="https://github.com/GamesCrafters/GamesmanUni/commits/main" target="_blank" rel="noreferrer"> {{ t("moreMessage") }} </a>
    </div>
</template>

<script lang="ts" setup>
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import { useI18n } from "vue-i18n";

    const store = useStore();
    const { t } = useI18n();
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

<i18n lang="json">
{
    "cn": {
        "title": "又更新了！？",
        "message0": "如果页脚显示的版本号落后于此处",
        "message1": "的最新版本， 请尝试使用",
        "message2": "或直接点击此处刷新页面以获取更新。",
        "message3": "本页面的所有时间信息均根据您的所在时区推算得出。",
        "failureMessage": "获取GitHub提交历史失败。",
        "moreMessage": "点此访问GitHub以获取完整更新历史……"
    },
    "en-US": {
        "title": "What's new?",
        "message0": "If latest version listed here does not match",
        "message1": "version in footer, new content is available.",
        "message2": "Please try refreshing the page to get latest patches and updates.",
        "message3": "All dates and times are in local timezone.",
        "failureMessage": "Failed to load GitHub commit history to this site.",
        "moreMessage": "Please visit GitHub for complete update history..."
    }
}
</i18n>
