<template>
    <div id="app-about">
        <VueMarkdownIt :linkify="true" :plugins="plugins" :source="source" />
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import VueMarkdownIt from "vue3-markdown-it";
    import MarkdownItLinkAttributes from "markdown-it-link-attributes";
    import AppAboutEnSource from "../../models/docs/AppAbout.md?raw";
    const plugins = [{ plugin: MarkdownItLinkAttributes, options: { attrs: { target: "_blank", rel: "noopener noreferrer nofollow" } } }];
    const source = computed(() => AppAboutEnSource);
</script>

<style lang="scss" scoped>
    #app-about {
        padding: 1rem 10%;
    }
</style>
