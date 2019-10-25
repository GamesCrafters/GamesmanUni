<template>
  <vue-markdown class="c-markdown" :source="markdownText"></vue-markdown>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import VueMarkdown from "vue-markdown";

@Component({
  components: {
    VueMarkdown
  }
})
export default class ExternalMarkdown extends Vue {
  @Prop({ default: "error.md" }) relativePath!: string;

  get markdownText() {
    return require("raw-loader!@/datas/markdowns/" + this.relativePath).default;
  }
}
</script>
