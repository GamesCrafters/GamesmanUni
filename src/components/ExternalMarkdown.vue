<template>
  <div class="app-external-markdown">
    <vue-markdown
      class="c-markdown"
      :source="markdownText"
      :anchorAttributes="anchorAttributes"
    ></vue-markdown>
  </div>
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
  @Prop() readonly relativePath!: string | undefined;

  get fileNotFoundFileFullPath() {
    return "datas/markdowns/" + this.$i18n.locale + "/FileNotFound.md";
  }

  get fullPathInCurrentLanguage() {
    return "datas/markdowns/" + this.$i18n.locale + "/" + this.relativePath;
  }

  get fullPathInFallbackLanguage() {
    return (
      "datas/markdowns/" + this.$i18n.fallbackLocale + "/" + this.relativePath
    );
  }

  get currentLanguage() {
    return this.$store.getters.languageDictionary.get(this.$i18n.locale);
  }

  get fallbackLanguage() {
    return this.$store.getters.languageDictionary.get(
      this.$i18n.fallbackLocale
    );
  }

  get markdownText() {
    try {
      if (require("raw-loader!@/" + this.fullPathInCurrentLanguage)) {
        return require("raw-loader!@/" + this.fullPathInCurrentLanguage)
          .default;
      }
    } catch (errorMessage) {
      console.warn(
        `"${this.relativePath}" is not available in ${this.currentLanguage}.`
      );
      try {
        if (require("raw-loader!@/" + this.fullPathInFallbackLanguage)) {
          console.warn(`Instead, it is loaded in ${this.fallbackLanguage}.`);
          return require("raw-loader!@/" + this.fullPathInFallbackLanguage)
            .default;
        }
      } catch (errorMessage) {
        console.warn(
          `"${this.relativePath}" is not available in ${this.fallbackLanguage} either.`
        );
      }
    }
    return require("raw-loader!@/" + this.fileNotFoundFileFullPath).default;
  }

  get anchorAttributes() {
    return {
      target: "_blank",
      rel: "noopener noreferrer nofollow"
    };
  }
}
</script>
