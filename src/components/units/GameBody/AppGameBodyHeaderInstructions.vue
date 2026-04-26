<template>
    <div id="app-game-body-header-instructions">
        <button @click="store.commit(mutationTypes.showInstructions, true)" title="Game Instructions">𝓲</button>
        <UniPopupWindow v-if="options && options.showInstructions" @close="store.commit(mutationTypes.showInstructions, false)">
            <VueMarkdownIt class="c-markdown" :break="true" :linkify="true" :plugins="plugins" :source="instructions" />
            If you worked on this project and were not properly credited, please email <a href="mailto: ddgarcia@cs.berkeley.edu">ddgarcia@cs.berkeley.edu</a> to request a correction.
        </UniPopupWindow>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import VueMarkdownIt from "vue3-markdown-it";
    import MarkdownItLinkAttributes from "markdown-it-link-attributes";
    import { actionTypes, mutationTypes, useStore } from "../../../scripts/plugins/store";
    import UniPopupWindow from "../../templates/UniPopupWindow.vue";

    const store = useStore();
    const options = computed(() => store.getters.options);
    const preferences = computed(() => store.getters.preferences);
    const instructions = computed(() => {
        let game = store.getters.game(store.getters.currentGameId);
        if (game && game.instructions) {
            if (!(preferences.value.locale in game.instructions)) {
                store.dispatch(actionTypes.addInstructions, {gameId: store.getters.currentGameId, variantId: store.getters.currentVariantId});
            }
            let instructions = game.instructions[preferences.value.locale];
            return instructions ? instructions : "# No Instructions Available"
        }
        return "# No Instructions Available";
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
    #app-game-body-header-instructions {
        button {
            border-radius: 8px;
            font-size: 16px;
            height: 40px;
            width: 40px;
            background: var(--gu-surface-hover);
            border: 1px solid var(--gu-border);
            color: var(--gu-text-body);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s;

            &:hover { background: #1b3a6b; color: #fff; border-color: #1b3a6b; transform: none; }
        }
    }
</style>
