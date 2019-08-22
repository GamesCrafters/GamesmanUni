<template>
  <div id="app-footer">
    <p id="app-footer-copyright">
      ©
      <a
        class="c-ext-link"
        href="http://gamescrafters.berkeley.edu/"
        target="_blank"
        rel="noreferrer"
        >GamesCrafters</a
      >
      and
      <a
        class="c-ext-link"
        href="https://regents.universityofcalifornia.edu/"
        target="_blank"
        rel="noreferrer"
        >UC Regents</a
      >
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppFooter extends Vue {}
</script>

<style lang="scss"></style>
