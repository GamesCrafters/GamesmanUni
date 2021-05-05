<template>
    <VueMarkdownIt class="c-markdown" :break="true" :linkify="true" :plugins="plugins" :source="source" />
</template>

<script lang="ts" setup>
    import VueMarkdownIt from "vue3-markdown-it";
    import MarkdownItLinkAttributes from "markdown-it-link-attributes";

    const plugins = [{ plugin: MarkdownItLinkAttributes, options: { attrs: { target: "_blank", rel: "noopener noreferrer nofollow" } } }];
    const source = "## About\n`GamesmanUni` is a web implementation of [`GamesmanClassic`](https://github.com/GamesCrafters/GamesmanClassic) in `C`, developed as part of [GamesCrafters](http://gamescrafters.berkeley.edu/) research and development group at [UC Berkeley](https://www.berkeley.edu/). `Gamesman` is a finite, two-person, perfect-information game generator based on Master thesis by [Professor Dan Garcia](https://people.eecs.berkeley.edu/~ddgarcia/).\n\n`GamesmanUni` is a [Progressive Web Application (PWA)](https://developers.google.com/web/progressive-web-apps/) as well as [Single Page Application (SPA)](https://en.wikipedia.org/wiki/Single-page_application). It is backwards compatible with older browser environments. It is designed to run on any platforms as long as there is an internet access and a browser with javascript enable. In devices with modern browsers, it is also possible to download the application as either desktop or mobile application.\n\nIf you are a developer, consult the developer documentation for more detailed information and make use of javascript console in the browser.";
</script>
