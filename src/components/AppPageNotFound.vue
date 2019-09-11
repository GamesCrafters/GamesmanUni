<template>
  <div id="app-page-not-found">
    <h2 id="app-page-not-found-title">Page not found... 😔</h2>
    <p class="c-text">
      Path to <span class="c-code-inline">{{ this.$route.fullPath }}</span> does
      not exist.
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppPageNotFound extends Vue {}
</script>
