<template>
  <div id="app-external-markdown">
    <vue-markdown class="c-markdown" :source="markdownText"></vue-markdown>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import VueMarkdown from "vue-markdown";
import { existsSync } from "fs";

@Component({
  components: {
    VueMarkdown
  }
})
export default class ExternalMarkdown extends Vue {
  @Prop({ default: "error.md" }) relativePath!: string;

  get markdownText() {
    const fs = require("fs");
    try {
      if (
        require("raw-loader!@/datas/markdowns/" +
          this.$i18n.locale +
          "/" +
          this.relativePath)
      ) {
        return require("raw-loader!@/datas/markdowns/" +
          this.$i18n.locale +
          "/" +
          this.relativePath).default;
      }
    } catch (errorMessage) {
      console.error(errorMessage);
      console.log(`"${this.relativePath}" is loaded in fallback language.`);
    }
    return require("raw-loader!@/datas/markdowns/" +
      this.$i18n.fallbackLocale +
      "/" +
      this.relativePath).default;
  }
}
</script>
