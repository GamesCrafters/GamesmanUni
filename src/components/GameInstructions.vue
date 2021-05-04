<template>
    <button @click="store.commit(mutationTypes.showInstruction, true)">𝓲</button>
    <PopupWindow v-if="store.state.app.game.options.showInstruction" @close="store.commit(mutationTypes.showInstruction, false)">
        <VueMarkdownIt class="c-markdown" :break="true" :linkify="true" :plugins="plugins" :source="store.state.app.game.instructions" />
    </PopupWindow>
</template>

<script lang="ts" setup>
    import VueMarkdownIt from "vue3-markdown-it";
    import MarkdownItLinkAttributes from "markdown-it-link-attributes";
    import { mutationTypes, useStore } from "../plugins/store";
    import PopupWindow from "./PopupWindow.vue";

    const store = useStore();
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
