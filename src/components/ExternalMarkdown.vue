<template>
  <div class="app-external-markdown">
    <vue-markdown
      class="c-markdown"
      :source="markdownTextSource"
      :anchorAttributes="anchorAttributes"
    ></vue-markdown>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import VueMarkdown from "vue-markdown";

@Component({
  components: {
    VueMarkdown
  }
})
export default class ExternalMarkdown extends Vue {
  @Prop() readonly relativePath!: string | undefined;

  get fileNotFoundFileFullPath(): string {
    return "datas/markdowns/" + this.$i18n.locale + "/FileNotFound.md";
  }

  get fullPathInCurrentLanguage(): string {
    return "datas/markdowns/" + this.$i18n.locale + "/" + this.relativePath;
  }

  get fullPathInFallbackLanguage(): string {
    return (
      "datas/markdowns/" + this.$i18n.fallbackLocale + "/" + this.relativePath
    );
  }

  get currentLanguage(): string {
    return this.$store.getters.languageDictionary.get(this.$i18n.locale);
  }

  get fallbackLanguage(): string {
    return this.$store.getters.languageDictionary.get(
      this.$i18n.fallbackLocale
    );
  }

  get markdownTextSource(): string {
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

  get anchorAttributes(): { target: string; rel: string } {
    return {
      target: "_blank",
      rel: "noopener noreferrer nofollow"
    };
  }
}
</script>
