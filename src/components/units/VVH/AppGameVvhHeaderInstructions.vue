<template>
    <div id="app-game-vvh-header-instructions">
        <button class="button" @click="store.commit(mutationTypes.showViewsInstructions, true)" title="View Instructions">𝓲</button>
        <UniPopupWindow v-if="options && options.showViewsInstructions" @close="store.commit(mutationTypes.showViewsInstructions, false)">
            <VueMarkdownIt class="c-markdown" :break="true" :linkify="true" :plugins="plugins" :source="viewsInstructions" />
            If you worked on this project and were not properly credited, please email <a href="mailto: ddgarcia@cs.berkeley.edu">ddgarcia@cs.berkeley.edu</a> to request a correction.
        </UniPopupWindow>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import VueMarkdownIt from "vue3-markdown-it";
    import MarkdownItLinkAttributes from "markdown-it-link-attributes";
    import { mutationTypes, useStore } from "../../../scripts/plugins/store";
    import UniPopupWindow from "../../templates/UniPopupWindow.vue";

    const store = useStore();
    const options = computed(() => store.getters.options);
    const viewsInstructions = `
        Lorem ipsum
    `;

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
    #app-game-vvh-header-instructions {
        > .button {
            border-radius: 100%;
            font-size: 2rem;
            height: max(2.5rem, min(5vh, 5vw));
            margin: 0.5rem 0;
            width: max(2.5rem, min(5vh, 5vw));
        }
    }
</style>
