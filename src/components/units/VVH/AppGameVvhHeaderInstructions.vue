<template>
    <button id="app-game-vvh-header-instructions" @click="store.commit(mutationTypes.showVvhInstructions, true)">𝓲</button>
    <UniPopupWindow v-if="options && options.showVvhInstructions" @close="store.commit(mutationTypes.showVvhInstructions, false)">
            <VueMarkdownIt class="c-markdown" :break="true" :linkify="true" :plugins="plugins" :source="vvhInstructions" />
            If you worked on this project and were not properly credited, please email <a href="mailto: ddgarcia@cs.berkeley.edu">ddgarcia@cs.berkeley.edu</a> to request a correction.
        </UniPopupWindow>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import VueMarkdownIt from "vue3-markdown-it";
    import MarkdownItLinkAttributes from "markdown-it-link-attributes";
    import { actionTypes, mutationTypes, useStore } from "../../../scripts/plugins/store";
    import UniPopupWindow from "../../templates/UniPopupWindow.vue";

    const store = useStore();
    const options = computed(() => store.getters.options);
    const vvhInstructions = computed(() => {
        if (false) {
            store.dispatch(actionTypes.addInstructions, {gameId: store.getters.currentGameId, variantId: store.getters.currentVariantId});
        }
    })
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
        border-radius: 100%;
        font-size: 2rem;
        height: max(2.5rem, min(5vh, 5vw));
        margin: 0.5rem 0;
        width: max(2.5rem, min(5vh, 5vw));
    }
</style>
