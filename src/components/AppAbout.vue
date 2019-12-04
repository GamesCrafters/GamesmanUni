<template>
  <div id="app-about">
    <ExternalMarkdown
      class="c-markdown"
      relativePath="AppAbout.md"
    ></ExternalMarkdown>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ExternalMarkdown from "@/components/ExternalMarkdown.vue";

@Component({
  components: {
    ExternalMarkdown
  }
})
export default class AppAbout extends Vue {}
</script>
