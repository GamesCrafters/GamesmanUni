<template>
    <VueMarkdownIt class="c-markdown" :break="true" :linkify="true" :plugins="plugins" :source="source" />
</template>

<script lang="ts" setup="props">
    import { defineProps, ref, watch } from "vue";
    import VueMarkdownIt from "vue3-markdown-it";
    import MarkdownItLinkAttributes from "markdown-it-link-attributes";
    import { useStore } from "../plugins/store";

    const props = defineProps<{ relativePath: string | undefined }>();
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

    const docs = import.meta.glob("../models/docs/*/*.md");
    console.log(Object.keys(docs));
    Object.keys(docs).map((path) => (docs[path] = () => import(`../${path.slice(3, -3)}.md?raw`)));

    const source = ref("");
    const getSource = () => {
        try {
            docs[`../models/docs/${store.state.app.preferences.locale}/${props.relativePath}`]().then((content) => (source.value = content.default));
        } catch (errorMessage) {
            console.warn(`${props.relativePath} is not available in ${store.state.app.preferences.locale}.`);
            try {
                console.warn(`Instead, it is being loaded in ${store.state.app.preferences.fallbackLocale}.`);
                docs[`../models/docs/${store.state.app.preferences.fallbackLocale}/${props.relativePath}`]().then((content) => (source.value = content.default));
            } catch (errorMessage) {
                console.warn(`Unfortunately, ${props.relativePath} is not available in ${store.state.app.preferences.fallbackLocale} either.`);
                docs[`../models/docs/${store.state.app.preferences.locale}/FileNotFound.md`]().then((content) => (source.value = content.default));
            }
        }
    };

    watch(
        () => store.state.app.preferences.locale,
        () => getSource()
    );

    getSource();
</script>
