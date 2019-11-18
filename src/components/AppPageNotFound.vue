<template>
  <div id="app-page-not-found">
    <h2 id="app-page-not-found-title">Page not found... 😔</h2>
    Path to <code>{{ this.$route.fullPath }}</code> does not exist.
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppPageNotFound extends Vue {}
</script>
