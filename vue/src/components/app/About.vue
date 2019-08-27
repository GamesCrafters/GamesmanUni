<template>
  <div id="app-about">
    <h2 id="app-about-title">About</h2>

    <p class="c-text">
      GamesmanUni is a web implementation of
      <a
        class="c-ext-link"
        href="https://github.com/GamesCrafters/GamesmanClassic"
        target="_blank"
        rel="noreferrer"
        >GamesmanClassic</a
      >
      in C, developed as part of
      <a
        class="c-ext-link"
        href="http://gamescrafters.berkeley.edu/"
        target="_blank"
        rel="noreferrer"
        >GamesCrafters</a
      >
      research and development group at
      <a
        class="c-ext-link"
        href="https://www.berkeley.edu"
        target="_blank"
        rel="noreferrer"
        >UC Berkeley</a
      >. Gamesman is a finite, two-person, perfect-information game generator
      based on Ph.D. thesis by
      <a
        class="c-ext-link"
        href="http://gamescrafters.berkeley.edu/"
        target="_blank"
        rel="noreferrer"
        >Professor Dan Garcia</a
      >.
    </p>

    <p class="c-text">
      GamesmanUni is a
      <a
        class="c-ext-link"
        href="https://developers.google.com/web/progressive-web-apps/"
        target="_blank"
        rel="noreferrer"
        >Progressive Web Application (PWA)</a
      >
      as well as
      <a
        class="c-ext-link"
        href="https://en.wikipedia.org/wiki/Single-page_application"
        target="_blank"
        rel="noreferrer"
        >Single Page Application (SPA)</a
      >. It is backwards compatible with older browser environments. It is
      designed to run on any platforms as long as there is an internet access
      and a browser with javascript enable. In devices with modern browsers, it
      is also possible to download the application as either desktop or mobile
      application.
    </p>

    <p class="c-text">
      The application is designed to work for everyone. Players can play the
      games just by going through UI navigations while researchers can use URL
      to load a specific game state from server. If you are a developer, make
      use of javascript console in the browser and consult the developer
      documentation for more detailed information.
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class About extends Vue {}
</script>

<style lang="scss"></style>
