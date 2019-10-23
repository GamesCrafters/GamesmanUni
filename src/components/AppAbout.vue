<template>
  <div id="app-about">
    <h2 id="app-about-title">About</h2>

    <p class="c-text">
      <span class="c-code-inline">GamesmanUni</span>
      is a web implementation of
      <a
        class="c-link-external"
        href="https://github.com/GamesCrafters/GamesmanClassic"
        target="_blank"
        rel="noreferrer"
      >
        <span class="c-code-inline">GamesmanClassic</span>
      </a>
      in
      <span class="c-code-inline">C</span>, developed as part of
      <a
        class="c-link-external"
        href="http://gamescrafters.berkeley.edu/"
        target="_blank"
        rel="noreferrer"
        >GamesCrafters</a
      >
      research and development group at
      <a
        class="c-link-external"
        href="https://www.berkeley.edu"
        target="_blank"
        rel="noreferrer"
        >UC Berkeley</a
      >
      .
      <span class="c-code-inline">Gamesman</span> is a finite, two-person,
      perfect-information game generator based on Master thesis by
      <a
        class="c-link-external"
        href="http://gamescrafters.berkeley.edu/"
        target="_blank"
        rel="noreferrer"
        >Professor Dan Garcia</a
      >
      .
    </p>

    <p class="c-text">
      <span class="c-code-inline">GamesmanUni</span> is a
      <a
        class="c-link-external"
        href="https://developers.google.com/web/progressive-web-apps/"
        target="_blank"
        rel="noreferrer"
        >Progressive Web Application (PWA)</a
      >
      as well as
      <a
        class="c-link-external"
        href="https://en.wikipedia.org/wiki/Single-page_application"
        target="_blank"
        rel="noreferrer"
        >Single Page Application (SPA)</a
      >
      . It is backwards compatible with older browser environments. It is
      designed to run on any platforms as long as there is an internet access
      and a browser with javascript enable. In devices with modern browsers, it
      is also possible to download the application as either desktop or mobile
      application.
    </p>

    <p class="c-text">
      If you are a developer, consult the developer documentation for more
      detailed information and make use of javascript console in the browser.
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppAbout extends Vue {}
</script>
