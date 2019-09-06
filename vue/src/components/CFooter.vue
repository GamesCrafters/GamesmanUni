<template>
  <div id="app-footer">
    <p id="app-footer-copyright">
      ©
      <a
        class="c-link-external"
        href="http://gamescrafters.berkeley.edu/"
        target="_blank"
        rel="noreferrer"
        >GamesCrafters</a
      >
      and
      <a
        class="c-link-external"
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
export default class CFooter extends Vue {}
</script>

<style lang="scss"></style>
