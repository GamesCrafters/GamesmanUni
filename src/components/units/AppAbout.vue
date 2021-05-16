<template>
    <div id="app-about">
        <VueMarkdownIt :linkify="true" :plugins="plugins" :source="source" />
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import VueMarkdownIt from "vue3-markdown-it";
    import MarkdownItLinkAttributes from "markdown-it-link-attributes";
    import AppAboutCnSource from "../../models/docs/cn/AppAbout.md?raw";
    import AppAboutEnSource from "../../models/docs/en/AppAbout.md?raw";
    import { useStore } from "../../scripts/plugins/store";

    const store = useStore();
    const plugins = [{ plugin: MarkdownItLinkAttributes, options: { attrs: { target: "_blank", rel: "noopener noreferrer nofollow" } } }];
    const source = computed(() => (store.getters.locale === "cn" ? AppAboutCnSource : AppAboutEnSource));
</script>

<style lang="scss" scoped>
    #app-about {
        padding: 1rem 10%;
    }
</style>
