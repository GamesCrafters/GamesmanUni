<template>
  <div id="app-page-not-found">
    <h2 id="app-page-not-found-title">Page not found... 😔</h2>
    <p class="c-text">
      Path to <span class="c-inline-code">{{ this.$route.fullPath }}</span> does
      not exist.
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class PageNotFound extends Vue {}
</script>

<style scoped lang="scss"></style>
