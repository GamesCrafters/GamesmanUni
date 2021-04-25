<template>
  <div class="app-external-markdown">
    <vue-markdown-it
      class="c-markdown"
      :content="markdownTextSource"
      :options="options"
    ></vue-markdown-it>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import MarkdownItVue from "markdown-it-vue";
import { CGame } from "@/classes/CGame";
import axios, { AxiosResponse } from "axios";
import { TRawErrorData } from "@/types/external/TRawErrorData";
import { TRawInstructionData } from "@/types/external/TRawInstructionData";

@Component({
  components: {
    "vue-markdown-it": Vue.extend(MarkdownItVue),
  },
})
export default class ExternalMarkdown extends Vue {
  @Prop() readonly relativePath!: string | undefined;
  @Prop() instructions!: string;

  get game(): CGame {
    return this.$store.getters.game;
  }

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

  async instructionPromise(): Promise<string> {
    const u: string =
      this.game.getDataSource() + "/instructions/" + this.game.getId();

    let r: string = "";

    try {
      const httpResponse: AxiosResponse = await axios.get(u);
      const rawData: TRawInstructionData | TRawErrorData = httpResponse.data;
      if (rawData.status == "ok") {
        r = rawData.response;
        console.log("r = " + r);
        return r;
      }
    } catch (error) {
      console.log(error);
    }
    return "file not found";
  }

  get markdownTextSource(): string {
    try {
      console.log("full path: " + this.fullPathInCurrentLanguage);
      if (
        this.fullPathInCurrentLanguage.startsWith(
          "datas/markdowns/en/gameInstructions"
        )
      ) {
        let t = this;
        this.instructionPromise().then(function (r) {
          t.instructions = r;
        });
        if (this.instructions !== "file not found") {
          return this.instructions;
        }
      }
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

  get options() {
    return {
      linkAttributes: {
        attrs: {
          target: "_blank",
          rel: "noopener noreferrer nofollow",
        },
      },
      katex: {
        throwOnError: false,
        errorColor: "#cc0000",
      },
      icons: "font-awesome",
      githubToc: {
        tocFirstLevel: 2,
        tocLastLevel: 3,
        tocClassName: "toc",
        anchorLinkSymbol: "",
        anchorLinkSpace: false,
        anchorClassName: "anchor",
        anchorLinkSymbolClassName: "octicon octicon-link",
      },
      mermaid: {
        theme: "default",
      },
      image: {
        hAlign: "left",
        viewer: true,
      },
    };
  }
}
</script>
