<template>
  <div id="app-footer">
    <p id="app-footer-frontend-version">
      <code>FrontEnd Version: {{ appVersion }}</code>
    </p>
    <p id="app-footer-backend-version">
      <code>BackEnd Version: {{ dataVersion }}</code>
    </p>
    <ExternalMarkdown
      id="app-footer-text"
      class="c-markdown"
      relativePath="footer.md"
    ></ExternalMarkdown>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import ExternalMarkdown from "@/components/ExternalMarkdown.vue";

@Component({
  components: {
    ExternalMarkdown
  }
})
export default class AppFooter extends Vue {
  get appVersion() {
    return this.$store.getters.appVersion;
  }

  get dataVersion() {
    return this.$store.getters.serverDataVersion;
  }
}
</script>
