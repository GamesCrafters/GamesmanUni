<template>
    <div id="app-game-body-header-instructions">
        <button @click="store.commit(mutationTypes.showInstructions, true)">𝓲</button>
        <UniPopupWindow v-if="options && options.showInstructions" @close="store.commit(mutationTypes.showInstructions, false)">
            <VueMarkdownIt class="c-markdown" :break="true" :linkify="true" :plugins="plugins" :source="instructions" />
        </UniPopupWindow>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import VueMarkdownIt from "vue3-markdown-it";
    import MarkdownItLinkAttributes from "markdown-it-link-attributes";
    import { mutationTypes, useStore } from "../../scripts/plugins/store";
    import UniPopupWindow from "../templates/UniPopupWindow.vue";

    const store = useStore();
    const options = computed(() => (store.getters.currentPlayer ? store.getters.currentPlayer.options : undefined));
    const instructions = computed(() => (store.getters.game(store.getters.currentGameType, store.getters.currentGameId) ? store.getters.game(store.getters.currentGameType, store.getters.currentGameId).instructions : ""));
    const plugins = [
        {
            plugin: MarkdownItLinkAttributes,
            options: {
                attrs: {
                    target: "_blank",
                    rel: "noopener noreferrer nofollow",
                },
            },
        },
    ];
</script>

<style lang="scss" scoped>
    #app-game-body-header-instructions {
        button {
            border-radius: 100%;
            font-size: 2rem;
            height: max(2.5rem, min(5vh, 5vw));
            width: max(2.5rem, min(5vh, 5vw));
        }
    }
</style>
