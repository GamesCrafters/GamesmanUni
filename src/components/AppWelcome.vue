<template>
  <div id="app-home">
    <vue-markdown id="app-home-title">## {{ $t("title") }}</vue-markdown>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VueMarkdown from "vue-markdown";

@Component({
  components: {
    VueMarkdown
  }
})
export default class AppWelcome extends Vue {}
</script>

<i18n>
{
  "cn": {
    "title": "欢迎！"
  },
  "en": {
    "title": "Welcome!"
  }
}
</i18n>
